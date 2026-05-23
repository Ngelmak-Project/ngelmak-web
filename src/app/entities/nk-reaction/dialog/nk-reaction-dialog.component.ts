import { Component, effect, inject, input, signal } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-reaction-dialog',
  templateUrl: './nk-reaction-dialog.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, ClickOutsideDirective],
})
export class ReactionDialogComponent {
  post = input<IPostDTO>();
  protected postState = signal<IPostDTO | null>(null);

  // Services
  protected readonly activeChannel = inject(ChannelService).channel;
  protected readonly alertService = inject(AlertService);
  protected readonly reactionService = inject(ReactionService);

  // UI state
  isOpen = signal(false);
  isSaving = signal(false);

  // Derived UI signals
  totalReactions = signal(0);
  emojiReactions = signal<string[]>([]);
  reactedByCurrentUser = signal<string | null>(null);

  emojis = ['👍', '❤️', '😂', '😮', '😡', '🤔'];

  // Sync immutable input → local writable state
  syncEffect = effect(() => {
    const p = this.post();
    if (p) this.postState.set(structuredClone(p));
  });

  // Recompute derived values when postState changes
  computeEffect = effect(() => {
    const p = this.postState();
    if (!p?.reactions) return;

    const counts = p.reactions.counts;

    this.totalReactions.set(Object.values(counts).reduce((a, b) => a + b, 0));
    this.emojiReactions.set(Object.keys(counts));
    this.reactedByCurrentUser.set(p.reactions.reactedByCurrentUser);
  });

  toggle() {
    this.isOpen.update((v) => !v);
  }

  select(emoji: string) {
    this.isOpen.set(false);

    const post = this.postState();
    if (!post?.reactions) return;

    const current = post.reactions.reactedByCurrentUser;
    const reactionId = post.reactions.reactionId;

    // Delete
    if (emoji === current) {
      this.save(this.reactionService.delete(reactionId), () => this.applyDelete());
      return;
    }

    // Create or update
    const reaction: IReaction = {
      id: reactionId ?? undefined,
      post: { id: post.id },
      emoji,
    };

    const req$ = reaction.id
      ? this.reactionService.update(reaction)
      : this.reactionService.create(reaction);

    this.save(req$, (r) => this.applyUpsert(r));
  }

  private save(result: Observable<HttpResponse<IReaction>>, onSuccess: (r: IReaction) => void) {
    this.isSaving.set(true);

    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => onSuccess(body),
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          translationKey: 'ngelmakTranslation.entities.reaction.dialog.alerts.error',
          message: 'Une erreur est survenue lors de la sauvegarde.',
        }),
    });
  }

  private applyUpsert(reaction: IReaction) {
    const post = this.postState();
    if (!post?.reactions) return;

    const oldEmoji = post.reactions.reactedByCurrentUser;
    const newEmoji = reaction.emoji;

    const counts = { ...post.reactions.counts };

    if (oldEmoji) {
      counts[oldEmoji]--;
      if (counts[oldEmoji] === 0) delete counts[oldEmoji];
    }

    counts[newEmoji] = (counts[newEmoji] ?? 0) + 1;

    this.postState.set({
      ...post,
      reactions: {
        ...post.reactions,
        reactedByCurrentUser: newEmoji,
        reactionId: reaction.id,
        counts,
      },
    });
  }

  private applyDelete() {
    const post = this.postState();
    if (!post?.reactions) return;

    const oldEmoji = post.reactions.reactedByCurrentUser;
    const counts = { ...post.reactions.counts };

    if (oldEmoji) {
      counts[oldEmoji]--;
      if (counts[oldEmoji] === 0) delete counts[oldEmoji];
    }

    this.postState.set({
      ...post,
      reactions: {
        ...post.reactions,
        reactedByCurrentUser: null,
        reactionId: null,
        counts,
      },
    });
  }
}
