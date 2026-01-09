import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";

/**
 * Customized video player.
 *
 * @author yusufaye
 * @inspearedby https://freshman.tech/custom-html5-video/
 * @doc For further reading please check '' for better understanding.
 */
@Component({
  selector: "app-video-plyr",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./video-plyr.component.html",
  styleUrl: "./video-plyr.component.scss",
})
export class VideoPlyrComponent implements AfterViewInit {
  @Input({ required: true }) source: string;
  @Input() lazyloaded: boolean = true;
  @Input() poster: string;
  @Input({ alias: "duration" }) initDuration: number = 0;
  @Input({ transform: booleanAttribute }) pictureInPictureEnabled: boolean = true;
  @Input({ transform: booleanAttribute }) fullscreenEnabled: boolean = true;
  @ViewChild("videoPlyr", { static: false })
  videoPlyr: ElementRef<HTMLElement>;

  private video: HTMLVideoElement = null;
  private videoControls: HTMLElement;
  private playButton: HTMLElement;
  private playbackIcons: NodeListOf<Element>;
  private timeElapsed: HTMLTimeElement;
  private duration: HTMLTimeElement;
  private progressBar: HTMLInputElement;
  private progressBarInput: HTMLInputElement;
  private progressBarTooltip: HTMLElement;
  private volumeButton: HTMLElement;
  private volumeIcons: NodeListOf<Element>;
  private volumeMute: HTMLElement;
  private volumeLow: HTMLElement;
  private volumeHigh: HTMLElement;
  private playbackPlayIcon: HTMLElement;
  private playbackPauseIcon: HTMLElement;
  private volume: HTMLInputElement;
  private playbackAnimation: HTMLElement;
  private fullscreenButton: HTMLElement;
  private videoContainer: HTMLElement;
  private fullscreenIcons: NodeListOf<SVGUseElement>;
  private pipButton: HTMLButtonElement;
  private settingsButton: HTMLButtonElement;
  private speedSettingsOptions: HTMLElement;
  private speeds: NodeListOf<HTMLInputElement>;

  ngAfterViewInit(): void {
    // Select elements here
    this.video = this.videoPlyr.nativeElement.querySelector(".plyr");
    this.playbackPlayIcon = this.videoPlyr.nativeElement.querySelector(
      'use[href="#playback-play"]'
    );
    this.playbackPauseIcon = this.videoPlyr.nativeElement.querySelector(
      'use[href="#playback-pause"]'
    );
    this.videoControls =
      this.videoPlyr.nativeElement.querySelector(".plyr-controls");
    this.playButton = this.videoPlyr.nativeElement.querySelector(".play");
    // Toggle the play/pause icons
    this.playbackIcons = this.videoPlyr.nativeElement.querySelectorAll(
      ".playback-icons use"
    );
    this.timeElapsed =
      this.videoPlyr.nativeElement.querySelector(".time-elapsed");
    this.duration = this.videoPlyr.nativeElement.querySelector(".duration");
    this.progressBar =
      this.videoPlyr.nativeElement.querySelector(".progress-bar");
    this.progressBarInput = this.videoPlyr.nativeElement.querySelector(
      ".progress-bar-input"
    );
    this.progressBarTooltip = this.videoPlyr.nativeElement.querySelector(
      ".progress-bar-tooltip"
    );
    this.volumeButton =
      this.videoPlyr.nativeElement.querySelector(".volume-button");
    this.volumeIcons =
      this.videoPlyr.nativeElement.querySelectorAll(".volume-button use");
    this.volumeMute = this.videoPlyr.nativeElement.querySelector(
      'use[href="#volume-mute"]'
    );
    this.volumeLow = this.videoPlyr.nativeElement.querySelector(
      'use[href="#volume-low"]'
    );
    this.volumeHigh = this.videoPlyr.nativeElement.querySelector(
      'use[href="#volume-high"]'
    );
    this.volume = this.videoPlyr.nativeElement.querySelector(".volume");
    this.playbackAnimation = this.videoPlyr.nativeElement.querySelector(
      ".plyr-playback-animation"
    );
    this.fullscreenButton =
      this.videoPlyr.nativeElement.querySelector(".fullscreen-button");
    if (!this.fullscreenEnabled) {
      this.fullscreenButton.classList.add('hidden');
    }
    this.videoContainer =
      this.videoPlyr.nativeElement.querySelector(".plyr-container");
    this.fullscreenIcons = this.fullscreenButton.querySelectorAll("use");
    this.pipButton = this.videoPlyr.nativeElement.querySelector(".pip-button");
    if (!this.pictureInPictureEnabled) {
      this.pipButton.classList.add('hidden');
    }
    this.settingsButton =
      this.videoPlyr.nativeElement.querySelector(".settings-button");
    this.speedSettingsOptions = this.videoPlyr.nativeElement.querySelector(
      ".plyr-speed-settings-options"
    );
    this.speeds = this.videoPlyr.nativeElement.querySelectorAll(".plyr-speed");
    this.video.controls = false; // hides native video controls.
    this.speeds.forEach((speed) => {
      speed.addEventListener("click", () => {
        this.video.playbackRate = Number(speed.value);
        this.toggleSettings();
      });
    });
    // Add eventlisteners here
    this.video.addEventListener("click", () => this.togglePlay());
    this.video.addEventListener("play", () => this.updatePlayButton()); // on play
    this.video.addEventListener("pause", () => this.updatePlayButton()); // on pause
    this.video.addEventListener(
      "loadedmetadata",
      () => this.initializeVideo(),
      { once: true }
    );
    this.video.addEventListener("timeupdate", () => this.updateTimeElapsed());
    this.video.addEventListener("timeupdate", () => this.updateProgress());
    this.video.addEventListener("volumechange", () => this.updateVolumeIcon());
    this.video.addEventListener("mouseenter", () => this.showControls());
    this.video.addEventListener("mouseleave", () => this.hideControls());
    this.playButton.addEventListener("click", () => this.togglePlay());
    this.videoControls.addEventListener("mouseenter", () =>
      this.showControls()
    );
    this.videoControls.addEventListener("mouseleave", () =>
      this.hideControls()
    );
    this.progressBarInput.addEventListener("mousemove", (event) =>
      this.updateSeekTooltip(event)
    );
    this.progressBarInput.addEventListener("input", (event) =>
      this.skipAhead(event)
    );
    this.volume.addEventListener("input", () => this.updateVolume());
    this.volumeButton.addEventListener("click", () => this.toggleMute());
    this.fullscreenButton.addEventListener("click", () =>
      this.toggleFullScreen()
    );
    this.videoContainer.addEventListener("fullscreenchange", () =>
      this.updateFullscreenButton()
    );
    this.pipButton.addEventListener("click", () => this.togglePip());
    this.settingsButton.addEventListener("click", () => this.toggleSettings());
    this.videoPlyr.nativeElement.addEventListener("keyup", (event) =>
      this.keyboardShortcuts(event)
    );
    // Hide the PiP button in browsers that do not support Picture-In-Picture (PiP) API
    this.videoPlyr.nativeElement.addEventListener("DOMContentLoaded", () => {
      if (!("pictureInPictureEnabled" in this.videoPlyr.nativeElement)) {
        this.pipButton.classList.add("hidden");
      }
    });
    if (this.initDuration > 0) {
      this.initializeVideo(this.initDuration);
    }
  }

  private lazyload(): void {
    this.video.src = this.source;
    this.playbackAnimation.style.opacity = "1";
    this.playbackAnimation.style.transform = "scale(1.3)";
    this.playbackAnimation.classList.add("animate-pulse");
    this.video.load();
    this.video.addEventListener(
      "loadedmetadata",
      () => {
        this.playbackAnimation.style.opacity = "0";
        this.playbackAnimation.style.transform = "scale(1)";
        this.playbackAnimation.classList.remove("animate-pulse");
        this.togglePlay();
      },
      { once: true }
    );
  }

  private togglePlay() {
    if (!this.video.src) {
      this.lazyload();
    } else {
      if (this.video.paused || this.video.ended) {
        this.video.play();
        this.playbackPlayIcon.classList.remove("hidden");
        this.playbackPauseIcon.classList.add("hidden");
      } else {
        this.video.pause();
        this.playbackPauseIcon.classList.remove("hidden");
        this.playbackPlayIcon.classList.add("hidden");
      }
      this.animatePlayback();
    }
  }

  // update the playback icon and tooltip depending on the playback state
  private updatePlayButton() {
    // toggle hidden class
    this.playbackIcons.forEach((icon) => icon.classList.toggle("hidden"));
    if (this.video.paused) {
      this.playButton.setAttribute("data-title", "Play (k)");
    } else {
      this.playButton.setAttribute("data-title", "Pause (k)");
    }
  }

  // Takes a time length in seconds and returns the time in minutes and seconds.
  private formatTime(timeInSeconds: number) {
    if (isNaN(timeInSeconds)) {
      return { minutes: "0", seconds: "0" };
    }
    const result = new Date(timeInSeconds * 1000)
      .toISOString()
      .substring(11, 19); // 00:26:36 -- indexed as 01:34:67
    return {
      minutes: result.substring(3, 5), // [ 3, 5 [
      seconds: result.substring(6, 8), // [ 6, 8 [
    };
  }

  // Sets the video duration, and maximum value of the progressBar.
  private initializeVideo(duration: number = 0) {
    const videoDuration =
      duration > 0 ? duration : Math.round(this.video.duration);
    this.progressBarInput.setAttribute("max", String(videoDuration));
    this.progressBar.setAttribute("max", String(videoDuration));
    const time = this.formatTime(videoDuration);
    this.duration.innerText = `${time.minutes}:${time.seconds}`;
    this.duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
  }

  // Follow the current playback of the video and update the time elapsed.
  private updateTimeElapsed() {
    const time = this.formatTime(Math.round(this.video.currentTime));
    this.timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    this.timeElapsed.setAttribute(
      "datetime",
      `${time.minutes}m ${time.seconds}s`
    );
  }

  // Update the progress bar with respect to the current playback.
  private updateProgress() {
    this.progressBarInput.value = String(Math.floor(this.video.currentTime));
    this.progressBar.value = String(Math.floor(this.video.currentTime));
  }

  // It uses the position of the mouse on the progress bar to roughly work out what point in the video the user will skip to if the progress bar is clicked at that point.
  private updateSeekTooltip(event) {
    const skipTo = Math.round(
      (event.offsetX / event.target.clientWidth) *
        parseInt(event.target.getAttribute("max"), 10)
    );
    this.progressBarInput.setAttribute("data-seek", String(skipTo));
    const time = this.formatTime(skipTo);
    this.progressBarTooltip.textContent = `${time.minutes}:${time.seconds}`;
    const rect = this.video.getBoundingClientRect();
    this.progressBarTooltip.style.left = `${event.pageX - rect.left}px`;
  }

  // Jumps to a different point in the video when the progress bar is clicked
  private skipAhead(event) {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;
    this.video.currentTime = skipTo;
    this.progressBar.value = skipTo;
    this.progressBarInput.value = skipTo;
  }

  // It updates the video's volume and disables the muted state if active
  private updateVolume() {
    if (this.video.muted) {
      this.video.muted = false;
    }
    this.video.volume = Number(this.volume.value);
  }

  // It updates the volume icon so that it correctly reflects the volume of the this.video.
  private updateVolumeIcon() {
    this.volumeIcons.forEach((icon) => icon.classList.add("hidden")); // hides all icons
    this.volumeButton.setAttribute("data-title", "Mute (m)");

    if (this.video.muted || this.video.volume === 0) {
      this.volumeMute.classList.remove("hidden");
      this.volumeButton.setAttribute("data-title", "Unmute (m)");
    } else if (this.video.volume > 0 && this.video.volume <= 0.5) {
      this.volumeLow.classList.remove("hidden");
    } else {
      this.volumeHigh.classList.remove("hidden");
    }
  }

  // It mutes or unmutes the video when executed. When the video is unmuted, the volume is returned to the value it was set before the video was muted.
  private toggleMute() {
    this.video.muted = !this.video.muted;

    if (this.video.muted) {
      // saved the previous value of the volume by setting up a new data-x attribute which can later be accessed through dataset.x
      this.volume.setAttribute("data-volume", this.volume.value);
      this.volume.value = "0";
    } else {
      this.volume.value = this.volume.dataset["volume"];
    }
  }

  // It displays an animation when the video is played or paused.
  private animatePlayback() {
    this.playbackAnimation.animate(
      [
        {
          opacity: 1,
          transform: "scale(1)",
        },
        {
          opacity: 0,
          transform: "scale(1.3)",
        },
      ],
      {
        duration: 500,
      }
    );
  }

  // It toggles the full screen state of the this.video.
  private toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.fullscreenElement) {
      // Need this to support Safari
      document.exitFullscreen();
    } else if (this.videoContainer.requestFullscreen) {
      // Need this to support Safari
      this.videoContainer.requestFullscreen();
    } else {
      this.videoContainer.requestFullscreen();
    }
  }

  // It changes the icon of the full screen button and tooltip to reflect the current full screen state of the video
  private updateFullscreenButton() {
    this.fullscreenIcons.forEach((icon) => icon.classList.toggle("hidden"));

    if (document.fullscreenElement) {
      this.fullscreenButton.setAttribute("data-title", "Exit full screen (f)");
    } else {
      this.fullscreenButton.setAttribute("data-title", "Full screen (f)");
    }
  }

  private toggleSettings() {
    this.speedSettingsOptions.classList.toggle("hide");
  }

  // It toggles Picture-in-Picture mode on the video
  private async togglePip() {
    try {
      if (this.video !== document.pictureInPictureElement) {
        this.pipButton.disabled = true;
        // The Picture-in-Picture (PiP) API allows users to watch videos in a floating window (always on top of other windows) so they can keep an eye on what they’re watching while interacting with other sites, or applications.
        await this.video.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.pipButton.disabled = false;
    }
  }

  // This hides the video controls when not in use, and if the video is paused, the controls must remain visible.
  private hideControls() {
    if (this.video.paused) {
      return;
    }

    this.videoControls.classList.add("hide");
  }

  // This displays the video controls
  private showControls() {
    this.videoControls.classList.remove("hide");
  }

  /**
   * This executes the relevant functions for each supported shortcut key.
   * k: Play or pause the video
   * m: Mute or unmute the video
   * f: Toggle fullscreen
   * p: Toggle Picture-in-Picture mode
   *
   * @param event
   */
  private keyboardShortcuts(event) {
    const { key } = event;
    switch (key) {
      case "k":
        this.togglePlay();
        this.animatePlayback();
        if (this.video.paused) {
          this.showControls();
        } else {
          setTimeout(() => {
            this.hideControls();
          }, 2000);
        }
        break;
      case "m":
        this.toggleMute();
        break;
      case "f":
        this.toggleFullScreen();
        break;
      case "p":
        this.togglePip();
        break;
    }
  }
}
