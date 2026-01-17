import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { IComment } from 'app/entities/models/nk-comment.model';
import { IPost } from 'app/entities/models/nk-post.model';
import { AccountViewComponent } from 'app/entities/nk-account/view/nk-account-view.component';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { FeedComponent } from 'app/entities/nk-feed/list/nk-feed.component';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [PostUpdateComponent, FeedComponent, AccountViewComponent]
})
export default class HomeComponent {
    /**
   * *bold*
   * _underline_
   * ~italics~
   * -delete-
   * @param text
   * @returns
   */
  format(text: string): string {
    return text
      .replace(/\*(.*?)\*/g, "<b>$1</b>") // -> bold
      .replace(/_(.*?)_/g, "<u>$1</u>") // -> underline
      .replace(/~(.*?)~/g, "<i>$1</i>") // -> italic
      .replace(/-(.*?)-/g, "<del>$1</del>"); // -> delete
  }

  @ViewChild("nkeditor", { static: false }) nkeditor: ElementRef<HTMLElement>;
  commentService = inject(CommentService);
  alertService = inject(AlertService);

  @Input() comment: IComment = null;
  @Input() post: IPost;
  @Output() onSaveSuccess = new EventEmitter<IComment>();

  file: File = null;
  isSaving = signal(false);
  isEmpty = signal(true);
  imageSrc = signal(null);
  editor: HTMLElement = null;

}
