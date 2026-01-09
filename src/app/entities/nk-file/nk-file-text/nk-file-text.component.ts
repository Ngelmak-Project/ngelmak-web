import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFile } from 'app/entities/models/nk-file.model';

@Component({
  selector: 'app-file-text',
  standalone: true,
  templateUrl: './nk-file-text.component.html',
  styleUrl: './nk-file-text.component.scss',
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class FileTextDialogComponent {
  // readonly dialogRef = inject(MatDialogRef<FileTextDialogComponent>);

  textContent: string = '';

  // quillConfiguration = quillConfiguration;
  quillConfiguration = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'size': [false, 'small', 'large', 'huge'] }],  // custom dropdown
      ['link'],
      ['clean'],
    ],
  };

  save() {
    // this.dialogRef.close({
    //   type: 'text',
    //   textContent: this.textContent,
    // } as IFile);
  }
}
