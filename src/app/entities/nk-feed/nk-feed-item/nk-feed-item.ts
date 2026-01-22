import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IFeedDTO } from 'app/entities/models/nk-feed.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { CommentComponent } from 'app/entities/nk-comment/list/nk-comment.component';
import { ReactionDialogComponent } from 'app/entities/nk-reaction/dialog/nk-reaction-dialog.component';
import { DurationPipe } from 'app/shared/date';

@Component({
  standalone: true,
  selector: 'app-feed-item',
  imports: [RouterModule, DurationPipe, ReactionDialogComponent, CommentComponent],
  templateUrl: './nk-feed-item.html',
})
export class FeedItem {
  @Input() feed: IFeedDTO;
  isOpen = signal(false);
  isCommentOpened = signal(false);

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

  toggleComment() {
    this.isCommentOpened.set(!this.isCommentOpened());
  }
}
