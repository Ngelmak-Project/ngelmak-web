import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AttachmentCategory } from "app/entities/enumerations/attachment-type.model";
import { IFile } from "app/entities/models/nk-file.model";

@Component({
  standalone: true,
  selector: "app-file-input",
  templateUrl: "./nk-file-input.component.html",
  styleUrl: "./nk-file-input.component.scss",
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class FileInputComponent {
  file = signal(null);

  // readonly dialogRef = inject(MatDialogRef<FileInputComponent>);
  fileForm = new FormGroup({
    caption: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.maxLength(50),
        Validators.pattern("^[a-zA-Z0-9!$&+_-]+"),
      ],
    }),
  });

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      const today = new Date();
      this.file.set({
        type: file.type,
        size: file.size,
        content: file,
        filename: `DOC_${today.getFullYear()}${
          today.getMonth() + 1
        }${today.getDay()}-${today.getHours()}${today.getMinutes()}${today.getSeconds()}_{file.name}.mp3`,
        caption: this.fileForm.getRawValue().caption,
        category: AttachmentCategory.DOCUMENT,
      } as IFile);
    }
  }

  save() {
    // this.dialogRef.close(this.file());
  }
}
