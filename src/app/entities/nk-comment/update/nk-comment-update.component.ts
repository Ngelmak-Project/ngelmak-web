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
  commentModel = signal<IComment | ICommentDTO>(initComment);

  commentForm = form(this.commentModel, (p) => {
    required(p.content, { message: 'nkTranslation.entities.comment.update.content.required' });
    maxLength(p.content, 1000, {
      message: 'nkTranslation.entities.comment.update.content.maxLength',
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
    comment.file = null; // [TODO] handle file selection
    if (comment.id) {
      this.subscribeToSaveResponse(this.commentService.update(comment, null));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment, null));
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
          translationKey: this.comment().id
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

  handleFile(event) {
    const obj: File = event.target.files[0];
    if (obj) {
      if (obj.type.startsWith('image/')) {
        const file: IFile = { filename: obj.name, size: obj.size, type: obj.type, data: obj };
        file.url = URL.createObjectURL(obj);
      } else {
        this.alertService.addAlert({
          type: 'warning',
          translationKey: 'ngelmakTranslation.entities.comment.update.alerts.videoNotSupported',
          message: 'Seulement les images sont prises en charge.',
        });
      }
    }
  }

  remove() {
    this.commentModel().file = null;
  }
}
