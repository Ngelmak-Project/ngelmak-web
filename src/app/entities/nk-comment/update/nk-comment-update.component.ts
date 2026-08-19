import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';
import { IComment, ICommentDTO } from 'app/entities/models/nk-comment.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { FilePickerComponent } from 'app/entities/nk-file/file-picker/file-picker.component';
import { ImageViewerComponent } from 'app/entities/nk-file/image-viewer/image-viewer.component';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { CommentService } from '../nk-comment.service';

const initComment: IComment = {
  id: null,
  content: '',
  file: null,
};

@Component({
  selector: 'app-comment-update',
  standalone: true,
  imports: [CommonModule, Field, SharedModule, FilePickerComponent, ImageViewerComponent],
  templateUrl: './nk-comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  withAttach = input(false);
  comment = input<IComment | ICommentDTO>(null);
  replyTo = input<IComment | ICommentDTO>(null);
  post = input<IPostDTO>(null);
  oncomment = output<ICommentDTO>(); // Signal to emit the saved comment back to the parent component.
  oncancel = output(); // Signal to emit the cancelled comment back to the parent component.

  commentService = inject(CommentService);
  alertService = inject(AlertService);

  isSaving = signal(false);
  protected deletedFile: IFile = null;
  selectedFile = signal<IFile>(null);

  commentModel = signal<IComment>(initComment);

  commentForm = form(this.commentModel, (p) => {
    required(p.content, { message: 'ngelmakTranslation.entities.comment.update.content.required' });
    maxLength(p.content, 5000, {
      message: 'ngelmakTranslation.entities.comment.update.content.maxLength',
    });
  });

  ngOnInit(): void {
    if (this.comment()) {
      this.commentModel.set({ ...this.comment(), file: null });
      this.selectedFile.set(this.comment().file);
    }
  }

  save() {
    this.isSaving.set(true);
    const comment = {
      ...this.commentModel(),
      post: this.post() ? { id: this.post().id } : null,
      replyTo: this.replyTo() ? { id: this.replyTo().id } : null,
    };

    // Trim content to remove leading and trailing whitespace.
    comment.content = comment.content.trim();
    const newMedia = this.selectedFile();
    if (comment.id) {
      this.subscribeToSaveResponse(this.commentService.update(comment, newMedia, this.deletedFile));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment, newMedia));
    }
  }

  /**
   * Cancels the comment creation or update process and emits a cancellation event to the parent component.
   */
  cancel() {
    this.removeFile(); // Clear file selection.
    this.commentForm().reset({ ...initComment }); // reset post values.
    this.oncancel.emit();
  }

  protected subscribeToSaveResponse(result): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => {
        // Emit the saved comment back to the parent component with all necessary data.
        this.oncomment.emit(body);
        // Reset the form and clear the file selection after successful save.
        this.removeFile(); // Clear file selection.
        this.commentForm().reset({ ...initComment }); // reset post values.
        this.alertService.addAlert({
          type: 'success',
          translationKey: this.comment()?.id
            ? 'ngelmakTranslation.entities.comment.update.alerts.created'
            : 'ngelmakTranslation.entities.comment.update.alerts.updated',
          message: 'Commentaire sauvegardé.',
        });
      },
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          translationKey: 'ngelmakTranslation.entities.comment.update.alerts.error',
          message: "Une erreur s'est produite lors de la sauvegarde.",
        }),
    });
  }

  addFiles(newFiles: IFile[]): void {
    if (newFiles.length > 0) {
      this.selectedFile.set(newFiles[0]);
    }
  }

  removeFile(idx?: number): void {
    const file = this.selectedFile();
    if (file.type == AttachmentType.IMAGE) {
      URL.revokeObjectURL(file.url);
    }
    this.selectedFile.set(null);
    if (file.id) {
      this.deletedFile = file;
    }
  }
}
