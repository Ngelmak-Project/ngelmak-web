import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { IComment, ICommentDTO } from 'app/entities/models/nk-comment.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { finalize, Observable } from 'rxjs';
import { CommentService } from '../nk-comment.service';

const initComment: IComment = {
  id: null,
  content: '',
  file: null,
};

@Component({
  selector: 'app-comment-update',
  standalone: true,
  imports: [CommonModule, Field],
  templateUrl: './nk-comment-update.component.html',
})
export class CommentUpdateComponent {
  commentService = inject(CommentService);
  alertService = inject(AlertService);

  commentModel = signal<IComment>(initComment);

  commentForm = form(this.commentModel, (p) => {
    required(p.content, { message: 'Le contenu de votre commentaire est requis.' });
    maxLength(p.content, 1000, { message: 'Nombre maximum de caractères est 1000.' });
  });

  @Input() withAttach: boolean = true;
  @Input() comment: IComment = null;
  @Input() replyTo: IComment | ICommentDTO = null;
  @Input() post: IPostDTO = null;
  @Output() onSaveSuccess = new EventEmitter<ICommentDTO>();

  isSaving = signal(false);

  save() {
    this.isSaving.set(true);
    const comment = {
      ...this.commentModel(),
      post: (this.post != null) ? { id: this.post.id } : null,
      replyTo: (this.replyTo != null) ? { id: this.replyTo.id } : null,
    };
    comment.content = comment.content.trim();
    comment.file = null; // [TODO] handle file selection
    if (comment.id) {
      this.subscribeToSaveResponse(this.commentService.update(comment, null));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment, null));
    }
  }

  protected subscribeToSaveResponse(result): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => {
        this.onSaveSuccess.emit(body);
        this.remove();
        this.commentForm().reset({ ...initComment, file: null }); // reset post values.
      },
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          message: "Une error s'est produit lors de la sauvegarde.",
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
          message: 'Seulement les images sont prises en charge.',
        });
      }
    }
  }

  remove() {
    this.commentModel().file = null;
  }
}
