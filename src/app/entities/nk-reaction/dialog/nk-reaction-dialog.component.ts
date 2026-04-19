import { Component, effect, inject, input, Input, OnInit, signal } from '@angular/core';
import { AlertService } from 'app/shared/alert/alert.service';

import { HttpResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { IReaction } from 'app/entities/models/nk-reaction.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import SharedModule from 'app/shared/shared.module';
import { finalize, Observable } from 'rxjs';
import { ReactionService } from '../nk-reaction.service';

// [TODO] Make sure that use has account before allowing him reaction
@Component({
  standalone: true,
  selector: 'app-reaction-dialog',
  templateUrl: './nk-reaction-dialog.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, ClickOutsideDirective],
})
export class ReactionDialogComponent {
  post = input<IPostDTO>();

  // Injected services
  activeChannel = inject(ChannelService).channel;
  alertService = inject(AlertService);
  reactionService = inject(ReactionService);

  // UI state signals
  isOpen = signal(false);
  isSaving = signal(false);

  // Reaction-related signals
  totalReactions = signal(0);
  emojiReactions = signal<string[]>([]);
  reactedByCurrentUser = signal<string | null>(null);

  // Available emojis
  emojis = ['👍', '❤️', '😂', '😮', '😡', '🤔'];

  /**
   * Effect: whenever the post() changes, recompute reaction data.
   * Replaces ngOnInit() + manual update().
   */
  updateEffect = effect(() => {
    const p = this.post();
    if (!p?.reactions) return;

    // Total count
    const total = Object.values(p.reactions.counts).reduce((acc, val) => acc + val, 0);
    this.totalReactions.set(total);

    // List of emojis used
    this.emojiReactions.set(Object.keys(p.reactions.counts));

    // Current user's reaction
    this.reactedByCurrentUser.set(p.reactions.reactedByCurrentUser);
  });

  /**
   * Toggle the emoji picker.
   */
  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  /**
   * User selects an emoji.
   * Handles create, update, or delete of a reaction.
   */
  select(emoji: string) {
    this.isOpen.set(false);

    const post = this.post();
    if (!post?.reactions) return;

    const currentEmoji = this.reactedByCurrentUser();
    const reactionId = post.reactions.reactionId;

    // Case 1: clicking the same emoji → delete reaction
    if (emoji === currentEmoji) {
      this.subscribeToSaveResponse(
        this.reactionService.delete(reactionId),
        this.onDelete.bind(this),
      );
      return;
    }

    // Case 2: create or update reaction
    const reaction: IReaction = {
      id: reactionId ?? undefined,
      channel: this.activeChannel(),
      post: { id: post.id },
      emoji,
    };

    const request$ = reaction.id
      ? this.reactionService.update(reaction)
      : this.reactionService.create(reaction);

    const callback = reaction.id ? this.onUpdate : this.onCreate;

    this.subscribeToSaveResponse(request$, callback.bind(this));
  }

  /**
   * Handle creation of a new reaction.
   */
  private onCreate(reaction: IReaction) {
    const post = this.post();
    if (!post?.reactions) return;

    this.incrementEmoji(reaction.emoji);
    post.reactions.reactedByCurrentUser = reaction.emoji;
    post.reactions.reactionId = reaction.id;
  }

  /**
   * Handle update of an existing reaction.
   */
  private onUpdate(reaction: IReaction) {
    const post = this.post();
    if (!post?.reactions) return;

    const oldEmoji = post.reactions.reactedByCurrentUser;
    this.decrementEmoji(oldEmoji);
    this.incrementEmoji(reaction.emoji);

    post.reactions.reactedByCurrentUser = reaction.emoji;
  }

  /**
   * Handle deletion of a reaction.
   */
  private onDelete(_: IReaction) {
    const post = this.post();
    if (!post?.reactions) return;

    const oldEmoji = post.reactions.reactedByCurrentUser;
    this.decrementEmoji(oldEmoji);

    post.reactions.reactedByCurrentUser = null;
    post.reactions.reactionId = null;
  }

  /**
   * Increment count for an emoji.
   */
  private incrementEmoji(emoji: string) {
    const counts = this.post()?.reactions?.counts;
    if (!counts) return;

    counts[emoji] = (counts[emoji] ?? 0) + 1;
  }

  /**
   * Decrement count for an emoji.
   */
  private decrementEmoji(emoji: string | null) {
    if (!emoji) return;

    const counts = this.post()?.reactions?.counts;
    if (!counts || !counts[emoji]) return;

    counts[emoji]--;
    if (counts[emoji] === 0) delete counts[emoji];
  }

  /**
   * Subscribe to save response and handle success/error.
   * Also resets isSaving when done.
   */
  private subscribeToSaveResponse(
    result: Observable<HttpResponse<IReaction>>,
    callback: (reaction: IReaction) => void,
  ): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => callback(body),
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          message: 'Une erreur est survenue lors de la sauvegarde.',
        }),
    });
  }
}
