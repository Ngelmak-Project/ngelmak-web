import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { IComment, ICommentDTO } from 'app/entities/models/nk-comment.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { CommentService } from '../nk-comment.service';
import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';

const initComment: IComment = {
  id: null,
  content: '',
  file: null,
};

@Component({
  selector: 'app-comment-update',
  standalone: true,
  imports: [CommonModule, Field, SharedModule],
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

  commentModel = signal<IComment>(initComment);

  commentForm = form(this.commentModel, (p) => {
    required(p.content, { message: 'ngelmakTranslation.entities.comment.update.content.required' });
    maxLength(p.content, 5000, {
      message: 'ngelmakTranslation.entities.comment.update.content.maxLength',
    });
  });

  ngOnInit(): void {
    if (this.comment()) {
      this.commentModel.set({ ...this.comment() });
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
    const newMedia = comment.file?.data || null;
    comment.file = null; // [TODO] handle file selection
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
    this.remove(); // Clear file selection.
    this.commentForm().reset({ ...initComment, file: null }); // reset post values.
    this.oncancel.emit();
  }

  protected subscribeToSaveResponse(result): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => {
        // Emit the saved comment back to the parent component with all necessary data.
        this.oncomment.emit(body);
        // Reset the form and clear the file selection after successful save.
        this.remove(); // Clear file selection.
        this.commentForm().reset({ ...initComment, file: null }); // reset post values.
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

  isImage(file: IFile): boolean {
    return file.type.startsWith('image/');
  }

  isVideo(file: IFile): boolean {
    return file.type.startsWith('video/');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(2)} ${units[index]}`;
  }

  extention(file: IFile): string {
    return file.type.split('/').pop()?.toUpperCase();
  }

  /**
   * Handles a file selected by the user.
   * Creates an IFile object, generates a preview URL for images,
   * warns the user if the file is a video, and stores the file in the post model.
   */
  handleFile(event): void {
    if (!this.withAttach()) return;

    // Extract the first selected file
    const obj: File = event.target.files[0];

    if (obj) {
      // Build the internal file representation
      const file: IFile = {
        filename: obj.name,
        size: obj.size,
        type: obj.type,
        data: obj,
      };

      if (this.isImage(file)) {
        // Generate a preview URL for images
        file.url = URL.createObjectURL(obj);
      } else if (this.isVideo(file)) {
        // Notify user that videos are not supported yet
        this.alertService.addAlert({
          type: 'info',
          translationKey: 'ngelmakTranslation.entities.comment.update.alerts.videoNotSupported',
          message: 'Les médias vidéos ne sont pas prise en compte pour les commentaires.',
        });
      } else {
        // Nothing need to be done for other media files.
      }

      // Add the file to the post model
      this.commentModel.update((c) => ({ ...c, file: file }));
    }
  }

  remove(): void {
    const file = this.commentModel().file;
    if (file.type == AttachmentType.IMAGE) {
      URL.revokeObjectURL(file.url);
    }
    this.commentModel.update((c) => ({ ...c, file: null }));
    if (file.id) {
      this.deletedFile = file;
    }
  }
}
