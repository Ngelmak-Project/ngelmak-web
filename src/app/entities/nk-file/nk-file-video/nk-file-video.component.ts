import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { IFile } from "app/entities/models/nk-file.model";

@Component({
  standalone: true,
  selector: "app-file-video",
  templateUrl: "./nk-file-video.component.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class FileVideoComponent implements OnInit {
  file = signal<IFile>(null);

  // readonly dialogRef = inject(MatDialogRef<FileVideoComponent>);
  fileForm = new FormGroup({
    caption: new FormControl("", {
      validators: [Validators.maxLength(100)],
    }),
  });
  videoURL = signal(null);
  posterURL = signal(null);
  frameCaptureAtTimeAsPoster = 5; // Default frame to consider as poster.
  videoFile: File;
  posterFile: Blob;
  duration: number;

  ngOnInit(): void {
    if (this.file()) {
      this.fileForm.patchValue(this.file());
      this.videoURL.set(this.file().url);
    }
  }

  /**
   * Video handler that loads video and capture poster.
   * @param event
   */
  handleVideo(event) {
    this.videoFile = event.target.files[0];
    if (this.videoFile) {
      this.videoURL.set(URL.createObjectURL(this.videoFile));
      const video = document.createElement("video");
      video.src = this.videoURL();
      video.muted = true;
      video.play();
      // 2. Capture the current frame into image.
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        const canvasContext = canvas.getContext("2d");
        // Set canvas size to match video.
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        // Draw the current video image on the canvas.
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Transform the current canvas as an image url.
        this.posterURL.set(canvas.toDataURL("image/png"));
        canvas.toBlob((blob) => (this.posterFile = blob), "image/png", 1);
        video.pause();
      };
      // 1. Set up the default frame to consider as poster.
      video.onloadeddata = () => {
        // move to frame at given time in second.
        // This will trigger the onseeked event to capture the fame as image and save it.
        video.currentTime = this.frameCaptureAtTimeAsPoster;
        // video.currentTime = Math.floor(video.duration * this.frameCaptureAtTimeAsPoster);
        this.duration = video.duration;
      };
    }
  }

  /**
   * Data file to use as poster of the video.
   * @param event
   */
  handlePoster(event) {
    this.posterFile = event.target.files[0];
    if (this.posterFile) {
      this.posterURL.set(URL.createObjectURL(this.posterFile));
    }
  }

  done() {
    const file = {
      type: this.videoFile.type,
      size: this.videoFile.size,
      filename: this.videoFile.name,
      duration: this.duration,
      caption: this.fileForm.value.caption,
      url: this.videoURL(),
      posterUrl: this.posterURL(),
      blob: this.videoFile,
      posterBlob: this.posterFile,
    } as IFile;
    // this.dialogRef.close(file);
  }
}
