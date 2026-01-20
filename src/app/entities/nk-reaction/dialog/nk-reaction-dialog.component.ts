import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { AlertService } from 'app/shared/alert/alert.service';

import { HttpResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { IReaction } from 'app/entities/models/nk-reaction.model';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import SharedModule from 'app/shared/shared.module';
import { finalize, Observable } from 'rxjs';
import { ReactionService } from '../nk-reaction.service';

export interface IPostReaction {
  postId?: number;
  accountId?: number;
  emoji?: string;
}

@Component({
  standalone: true,
  selector: 'app-reaction-dialog',
  templateUrl: './nk-reaction-dialog.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReactionDialogComponent implements OnInit {
  @Input() post: IPostDTO;
  @Output() reaction = new EventEmitter<string>();

  account = inject(AccountService).trackCurrentAccount();
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
    this.update();
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  update() {
    const value = Object.values(this.post.reactions.counts).reduce((acc, val) => acc + val, 0);
    this.totalReactions.set(value);
    const emojis = Object.keys(this.post.reactions.counts);
    this.emojiReactions.set(emojis);
    this.reactedByCurrentUser.set(this.post.reactions.reactedByCurrentUser);
  }

  select(emoji: string) {
    this.isOpen.set(false);
    const currentEmoji = this.reactedByCurrentUser();
    const reactionId = this.post.reactions.reactionId;

    // Case 1: user clicks the same emoji → delete reaction
    if (emoji === currentEmoji) {
      this.subscribeToSaveResponse(
        this.reactionService.delete(reactionId),
        this.onDelete.bind(this),
      );
      return;
    }

    // Case 2: user changes or adds a reaction
    const reaction: IReaction = {
      id: reactionId ?? undefined,
      account: this.account(),
      post: { id: this.post.id },
      emoji,
    };

    const request$ = reaction.id
      ? this.reactionService.update(reaction)
      : this.reactionService.create(reaction);

    const callback = reaction.id ? this.onUpdate : this.onCreate;

    this.subscribeToSaveResponse(request$, callback.bind(this));
  }

  private onCreate(reaction: IReaction) {
    this.incrementEmoji(reaction.emoji);
    this.post.reactions.reactedByCurrentUser = reaction.emoji;
    this.post.reactions.reactionId = reaction.id;
  }

  private onUpdate(reaction: IReaction) {
    const oldEmoji = this.post.reactions.reactedByCurrentUser;
    this.decrementEmoji(oldEmoji);
    this.incrementEmoji(reaction.emoji);
    this.post.reactions.reactedByCurrentUser = reaction.emoji;
  }

  private onDelete(_: IReaction) {
    const oldEmoji = this.post.reactions.reactedByCurrentUser;
    this.decrementEmoji(oldEmoji);
    this.post.reactions.reactedByCurrentUser = null;
    this.post.reactions.reactionId = null;
  }

  private incrementEmoji(emoji: string) {
    const counts = this.post.reactions.counts;
    counts[emoji] = (counts[emoji] ?? 0) + 1;
  }

  private decrementEmoji(emoji: string) {
    const counts = this.post.reactions.counts;
    if (!counts[emoji]) return;
    counts[emoji]--;
    if (counts[emoji] === 0) {
      delete counts[emoji];
    }
  }

  private subscribeToSaveResponse(
    result: Observable<HttpResponse<IReaction>>,
    callback: (reaction: IReaction) => void,
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
