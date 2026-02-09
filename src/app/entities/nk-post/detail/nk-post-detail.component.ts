import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import SharedModule from 'app/shared/shared.module';

import { IFile } from 'app/entities/models/nk-file.model';
import { CommentComponent } from 'app/entities/nk-comment/list/nk-comment.component';
import { ReactionDialogComponent } from 'app/entities/nk-reaction/dialog/nk-reaction-dialog.component';
import { DurationPipe } from 'app/shared/date';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { PostService } from '../nk-post.service';
import { finalize } from 'rxjs';
import { AlertService } from 'app/shared/alert/alert.service';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';

@Component({
  standalone: true,
  selector: 'app-post-detail',
  templateUrl: './nk-post-detail.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    DurationPipe,
    ClickOutsideDirective,
    ReactionDialogComponent,
    CommentComponent,
    ConfirmDialogComponent,
  ],
})
export class PostDetailComponent implements OnInit {
  post = input.required<IPostDTO>();
  onDeleted = output<IPostDTO>();
  postSig = signal<IPostDTO>(null);

  openMenu = signal(false);
  confirmDeleteOpen = signal(false);
  isDeleting = signal(false);
  isUpdating = signal(false);
  isCommentOpened = signal(false);

  alertService = inject(AlertService);
  protected postService = inject(PostService);

  channel = inject(ChannelService).channel;

  ngOnInit() {
    this.postSig.set(this.post());
  }

  isImage(file: IFile): boolean {
    return file.type.startsWith('image/');
  }

  isVideo(file: IFile): boolean {
    return file.type.startsWith('video/');
  }

  extention(file: IFile): string {
    return file.type.split('/').pop()?.toUpperCase();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(2)} ${units[index]}`;
  }

  handleDeleteConfirm(result: boolean) {
    this.confirmDeleteOpen.set(false);
    if (result) {
      this.isDeleting.set(true);
      this.postService
        .delete(this.postSig().id)
        .pipe(
          finalize(() => {
            this.isDeleting.set(false);
            this.openMenu.set(false);
          }),
        )
        .subscribe({
          next: () => {
            this.onDeleted.emit(this.postSig());
          },
          error: () =>
            this.alertService.addAlert({
              type: 'error',
              message: "Une error s'est produit lors de la suppression.",
            }),
        });
    }
  }
}
