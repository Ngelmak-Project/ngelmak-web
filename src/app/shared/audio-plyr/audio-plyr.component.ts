import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import { IFile } from "app/entities/models/nk-file.model";
import { FileService } from "app/entities/nk-file/service/nk-file.service";
import { fadeInRight400ms } from "../animations/fade-in-right.animation";
import { fadeInUp400ms } from "../animations/fade-in-up.animation";
import { ClickOutsideDirective } from "../directives/click-outside.directive";

/**
 * This component is used for playing mp3 soung.
 *
 * Inspered by https://webdesign.tutsplus.com/build-a-custom-html-music-player-using-javascript-and-the-web-audio-api--cms-93300t
 * Check the tutoral here https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
 * Check also the official documentation for more details https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.
*
* Usage example:
* @example
*
* @author Yusufaye
*/
@Component({
  standalone: true,
  selector: 'audio-plyr',
  templateUrl: './audio-plyr.component.html',
  styleUrl: './audio-plyr.component.scss',
  imports: [CommonModule, ClickOutsideDirective],
  animations: [fadeInRight400ms, fadeInUp400ms],
})
export class AudioPlyrComponent implements OnInit, AfterViewInit, OnDestroy {
  private fileService = inject(FileService);

  @Input() source: Blob = null;
  @Input() url: string = null;
  @Input() file: IFile = null;
  private audio: HTMLAudioElement = null;
  private audioContext: AudioContext = null;
  private track: MediaElementAudioSourceNode = null;
  private gainNode: GainNode = null;
  private progress: HTMLElement = null;
  private progressFilled: HTMLElement = null;
  private volumeProgressFilled: HTMLElement = null;
  private volumeProgress: HTMLElement = null;
  private mousedown: boolean = false;
  private volumeMousedown: boolean = false;
  private volume: number = 0;
  plyrCurrentTime = '';
  plyrDuration = '';
  isPlaying = signal(false);
  isMuted = signal(false);
  isSetup = signal(false);
  isLoading = signal(false);

  /** Query the template for the audio player on which to add all our events.
    * Don't use document for subscribing to elements in the view, this will be apply to the entire DOM rather than the simply at the component instance.
   */
  @ViewChild('plyr', { static: false }) plyr: ElementRef<HTMLElement>;
  showMenu: boolean = false;
  showSettings: boolean = false;
  settingsSpeedOptions = [
    { name: '1.75&times;', value: 1.75, checked: false },
    { name: '1.5&times;', value: 1.5, checked: false },
    { name: 'Normal', value: 1, checked: true },
    { name: '0.5&times;', value: 0.5, checked: false },
    { name: '0.75&times;', value: 0.75, checked: false },
  ]

  get settingsSpeedValue(): string {
    return this.settingsSpeedOptions.filter(e => e.checked).pop().name;
  }

  ngOnInit(): void {
    if (this.url == null && this.source == null) {
      this.plyrCurrentTime = this.format(0);
      this.plyrDuration = this.format(this.file.duration);
    }
  }

  ngAfterViewInit(): void {
    this.setup();
  }

  lazyload(): void {
    this.fileService.getResource(this.file.id).subscribe(response => {
      this.source = response;
      this.setup();
      this.togglePlay();
    });
  }

  // private saveAsExcelFile(buffer: any): void {
  //   const data: Blob = new Blob([buffer], { type: doc.dataContentType });
  //   FileSaver.saveAs(data, doc.title);
  // }

  private init() {
    this.volume = .5;
    this.audio.volume = this.volume;
    this.setTimes();
  }

  private setup(): void {
    if (this.url == null && this.source) {
      this.url = URL.createObjectURL(this.source);
    } else {
      console.log('Resource not set yet...');
      return;
    }
    this.isSetup.set(true);
    this.progress = this.plyr.nativeElement.querySelector('.ngelmak-plyr-progress');
    this.progressFilled = this.plyr.nativeElement.querySelector('.ngelmak-plyr-progress-filled');
    this.volumeProgress = this.plyr.nativeElement.querySelector('.ngelmak-plyr-volume-progress');
    this.volumeProgressFilled = this.plyr.nativeElement.querySelector('.ngelmak-plyr-volume-progress-filled');
    this.audio = new Audio(this.url);

    this.audioContext = new AudioContext();
    // The volume can be manipulated using a GainNode, which represents how big our sound wave is.
    this.gainNode = this.audioContext.createGain(); // or with constructor GainNode.
    // Define the audio graph graph with the input being connected to the gain, and the later being connected to the destination (output).
    this.track = this.audioContext.createMediaElementSource(this.audio)
    this.track.connect(this.gainNode).connect(this.audioContext.destination);

    // Volume events
    this.volumeProgress.addEventListener('click', (e) => this.updateVolume(e));
    this.volumeProgress.addEventListener('mousemove', (e) => this.volumeMousedown && this.updateVolume(e));
    this.volumeProgress.addEventListener('mousedown', () => (this.volumeMousedown = true));
    this.volumeProgress.addEventListener('mouseup', () => (this.volumeMousedown = false));

    this.progress.addEventListener('click', (e) => this.updateCurrentTime(e));
    this.progress.addEventListener('mousemove', (e) => this.mousedown && this.updateCurrentTime(e));
    this.progress.addEventListener('mousedown', () => (this.mousedown = true));
    this.progress.addEventListener('mouseup', () => (this.mousedown = false));
    // When the track finishes playing.
    this.audio.addEventListener('loadedmetadata', () => this.init(), { once: true });
    this.audio.addEventListener('ended', () => (this.isPlaying.set(false)), false);
    // Update progress bar and time values as audio plays
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgressBar();
      this.setTimes();
    });
    // Update progress bar of volume
    this.audio.addEventListener('volumechange', () => this.updateVolumeProgressBar());
  }

  playbackRate(index: number) {
    this.audio.playbackRate = this.settingsSpeedOptions[index].value;
    this.settingsSpeedOptions[index].checked = true;
    this.settingsSpeedOptions.forEach((e, i) => i == index ? (e.checked = true) : (e.checked = false));
  }

  toggle() {
    if (this.showMenu) {
      this.showSettings = false;
    }
    this.showMenu = !this.showMenu;
  }

  ngOnDestroy(): void {
    if (this.url) {
      URL.revokeObjectURL(this.url);
    }
  }

  toggleMute() {
    if (this.isMuted) {
      this.audio.volume = this.volume;
    } else {
      this.audio.volume = 0;
    }
    this.isMuted.set(!this.isMuted());
  }

  togglePlay() {
    // Check if context is in suspended state (autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    // Play or pause track depending on state
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying.set(!this.isPlaying());
  }

  updateCurrentTime(event) {
    this.audio.currentTime = (event.offsetX / this.progress.offsetWidth) * this.audio.duration;
  }

  updateVolume(event) {
    const offsetX = Math.min(this.volumeProgress.offsetWidth, Math.max(0, event.offsetX));
    this.volume = offsetX / this.volumeProgress.offsetWidth;
    this.audio.volume = this.volume;
  }

  updateVolumeProgressBar() {
    this.volumeProgressFilled.style.flexBasis = `${this.audio.volume * 100}%`;
  }

  // Update player timeline progress visually
  updateProgressBar() {
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    this.progressFilled.style.flexBasis = `${percent}%`;
  }

  // Display currentTime and duration properties in real-time
  setTimes() {
    this.plyrCurrentTime = this.format(this.audio.currentTime);
    const duration = this.audio.duration == Infinity ? this.file.duration : this.audio.duration
    this.plyrDuration = this.format(duration);
  }

  private filling(value: number): string {
    return (value < 10) ? `0${value}` : `${value}`;
  }

  private format(duration: number): string {
    let hour: any = 0, min: number, sec: number;
    min = Math.floor(duration / 60);
    sec = Math.ceil(duration) - (60 * min);
    if (min >= 60) {
      hour = Math.floor(duration / 60);
      min = min - (60 * hour);
    }
    if (hour > 0) {
      return `${hour}:${this.filling(min)}:${this.filling(sec)}`;
    }
    return `${this.filling(min)}:${this.filling(sec)}`;
  }
}
