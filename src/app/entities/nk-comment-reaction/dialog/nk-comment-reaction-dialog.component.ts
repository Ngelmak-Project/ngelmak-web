import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { AlertService } from 'app/shared/alert/alert.service';

import { HttpResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICommentReaction } from 'app/entities/models/nk-comment-reaction.model';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import SharedModule from 'app/shared/shared.module';
import { finalize, Observable } from 'rxjs';
import { ReactionService } from '../nk-comment-reaction.service';

@Component({
  standalone: true,
  selector: 'app-comment-reaction-dialog',
  templateUrl: './nk-comment-reaction-dialog.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CommentReactionDialogComponent implements OnInit {
  @Input() comment: ICommentDTO;

  account = inject(AccountService).account;
  alertService = inject(AlertService);
  reactionService = inject(ReactionService);

  @ViewChild('buttonRef') buttonRef!: ElementRef;
  isOpen = signal(false);
  isSaving = signal(false);
  totalReactions = signal(0);
  emojiReactions = signal([]);
  reactedByCurrentUser = signal('');
  selected = '';
  emojis = ['👍', '❤️', '😂', '😮', '😡', '🤔'];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // this.update();
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  update() {
    const value = Object.values(this.comment.reactions.counts).reduce((acc, val) => acc + val, 0);
    this.totalReactions.set(value);
    const emojis = Object.keys(this.comment.reactions.counts);
    this.emojiReactions.set(emojis);
    this.reactedByCurrentUser.set(this.comment.reactions.reactedByCurrentUser);
  }

  select(emoji: string) {
    this.isOpen.set(false);
    const currentEmoji = this.reactedByCurrentUser();
    const reactionId = this.comment.reactions.reactionId;

    // Case 1: user clicks the same emoji → delete reaction
    if (emoji === currentEmoji) {
      this.subscribeToSaveResponse(
        this.reactionService.delete(reactionId),
        this.onDelete.bind(this),
      );
      return;
    }

    // Case 2: user changes or adds a reaction
    const reaction: ICommentReaction = {
      id: reactionId ?? undefined,
      account: this.account(),
      comment: { id: this.comment.id },
      emoji,
    };

    const request$ = reaction.id
      ? this.reactionService.update(reaction)
      : this.reactionService.create(reaction);

    const callback = reaction.id ? this.onUpdate : this.onCreate;

    this.subscribeToSaveResponse(request$, callback.bind(this));
  }

  private onCreate(reaction: ICommentReaction) {
    this.incrementEmoji(reaction.emoji);
    this.comment.reactions.reactedByCurrentUser = reaction.emoji;
    this.comment.reactions.reactionId = reaction.id;
  }

  private onUpdate(reaction: ICommentReaction) {
    const oldEmoji = this.comment.reactions.reactedByCurrentUser;
    this.decrementEmoji(oldEmoji);
    this.incrementEmoji(reaction.emoji);
    this.comment.reactions.reactedByCurrentUser = reaction.emoji;
  }

  private onDelete(_: ICommentReaction) {
    const oldEmoji = this.comment.reactions.reactedByCurrentUser;
    this.decrementEmoji(oldEmoji);
    this.comment.reactions.reactedByCurrentUser = null;
    this.comment.reactions.reactionId = null;
  }

  private incrementEmoji(emoji: string) {
    const counts = this.comment.reactions.counts;
    counts[emoji] = (counts[emoji] ?? 0) + 1;
  }

  private decrementEmoji(emoji: string) {
    const counts = this.comment.reactions.counts;
    if (!counts[emoji]) return;
    counts[emoji]--;
    if (counts[emoji] === 0) {
      delete counts[emoji];
    }
  }

  private subscribeToSaveResponse(
    result: Observable<HttpResponse<ICommentReaction>>,
    callback: (reaction: ICommentReaction) => void,
  ): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => {
        callback(body);
        this.update();
      },
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          message: 'Une erreur est survenue lors de la sauvegarde.',
        }),
    });
  }

  // Close when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
