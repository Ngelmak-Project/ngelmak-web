import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFile } from 'app/entities/models/nk-file.model';
import { FileTextDialogComponent } from '../nk-file-text/nk-file-text.component';

@Component({
  standalone: true,
  selector: 'app-file-voice-recorder',
  templateUrl: './nk-file-voice-recorder.component.html',
  styleUrl: './nk-file-voice-recorder.component.scss',
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class FileVoiceRecoderComponent {
  // readonly dialogRef = inject(MatDialogRef<FileTextDialogComponent>);

  isStarted = signal(false);

  private duration = 0;
  private mediaRecorder: MediaRecorder = null;
  private interval = null;
  private chunks = [];
  timer: string = '00:00';

  private clear(): void {
    this.chunks = [];
    if (this.interval) window.clearInterval(this.interval);
    this.mediaRecorder = null;
  }

  start() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true /* only audio needed */ })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
          this.mediaRecorder.onstop = async () => {
            const blob = new Blob(this.chunks, { type: 'audio/webm' });
            this.clear();
            if (blob.size > 0) {
              const today = new Date();
              // this.dialogRef.close({
              //   type: 'audio/webm',
              //   size: blob.size,
              //   content: blob,
              //   duration: this.duration + 1,
              //   filename: `voice_recorder_${today.getFullYear()}${today.getMonth() + 1}${today.getDay()}-${today.getHours()}${today.getMinutes()}${today.getSeconds()}.mp3`,
              // } as IFile);
            }
          };
          this.mediaRecorder.start(); // timeslice could be precised
          this.startTimer();
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  private startTimer() {
    this.interval = setInterval(() => {
      let min: any, sec: any;
      if (this.mediaRecorder.state == 'recording') {
        this.duration++;
        min = Math.floor(this.duration / 60);
        sec = this.duration - (60 * min);
        if (min < 10)
          min = `0${min}`;
        if (sec < 10)
          sec = `0${sec}`;
        this.timer = `${min}:${sec}`;
      }
    }, 1000);
  }

  resume() {
    this.mediaRecorder.resume();
  }

  pause() {
    this.mediaRecorder.pause();
  }

  stop() {
    this.isStarted.set(false);
    this.mediaRecorder.stop();
    if (this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  toggleRecording() {
    if (this.isStarted()) {
      (this.mediaRecorder.state == 'recording') ? this.pause() : this.resume();
    } else {
      this.start();
      this.isStarted.set(true);
    }
  }

  save() {
    this.stop();
  }
}
