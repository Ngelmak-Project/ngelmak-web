import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';

/**
 * Structural directive that conditionally renders its host template
 * only when the current user's channel ID matches the provided one.
 *
 * Usage:
 *   <div *showForChannel="abc123">Visible only for channel abc123</div>
 *
 * This directive expects that your application provides a signal
 * representing the current user's channel ID.
 */
@Directive({
  selector: '[showForChannel]',
  standalone: true,
})
export class ShowForChannelDirective {
  /**
   * Required input for the channel ID
   */
  showForChannel = input.required<number>();

  /** Template reference for the content to be conditionally rendered */
  private templateRef = inject(TemplateRef<any>);

  /** View container for managing the embedded view */
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    // Inject the channel service to access current channel
    const channel = inject(ChannelService).channel;

    effect(() => {
      // Check if channel exists and matches the required channel ID
      if (channel() && channel().id === this.showForChannel()) {
        // Render the template view if channel matches
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        // Clear the view container if channel doesn't match
        this.viewContainerRef.clear();
      }
    });
  }
}
