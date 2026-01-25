import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { IComment, ICommentDTO } from 'app/entities/models/nk-comment.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { AlertService } from 'app/shared/alert/alert.service';
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
  imports: [CommonModule, Field],
  templateUrl: './nk-comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  withAttach = input(true);
  comment = input<IComment | ICommentDTO>(null);
  replyTo = input<IComment | ICommentDTO>(null);
  post = input<IPostDTO>(null);
  onSaveSuccess = output<ICommentDTO>();

  commentService = inject(CommentService);
  alertService = inject(AlertService);

  isSaving = signal(false);
  commentModel = signal<IComment | ICommentDTO>(initComment);

  commentForm = form(this.commentModel, (p) => {
    required(p.content, { message: 'Le contenu de votre commentaire est requis.' });
    maxLength(p.content, 1000, { message: 'Nombre maximum de caractères est 1000.' });
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
      post: this.post() != null ? { id: this.post().id } : null,
      replyTo: this.replyTo != null ? { id: this.replyTo().id } : null,
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
