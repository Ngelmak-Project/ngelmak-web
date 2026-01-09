import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { IFile } from "app/entities/models/nk-file.model";

@Component({
  standalone: true,
  selector: "app-file-image",
  templateUrl: "./nk-file-image.component.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class FileImageComponent implements OnInit {
  file = signal<IFile>(null);

  // readonly dialogRef = inject(MatDialogRef<FileImageComponent>);
  fileForm = new FormGroup({
    caption: new FormControl("", {
      validators: [Validators.maxLength(100)],
    }),
  });
  imageURL = signal(null);
  media: File;

  ngOnInit(): void {
    if (this.file()) {
      this.fileForm.patchValue(this.file());
      this.imageURL.set(this.file().url);
    }
  }

  handleImage(event) {
    this.media = event.target.medias[0];
    if (this.media) {
      this.imageURL.set(URL.createObjectURL(this.media));
    }
  }

  done() {
    URL.revokeObjectURL(this.imageURL());
    this.imageURL.set(null);
    const file = {
      url: this.imageURL(),
      type: this.media.type,
      size: this.media.size,
      medianame: this.media.name,
      caption: this.fileForm.value.caption,
      blob: this.media,
    } as IFile;
    // this.dialogRef.close(file);
  }
}
