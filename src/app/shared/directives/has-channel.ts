import { Directive, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';

/**
 * Structural directive that conditionally renders its host template
 * only when the current user's has a channel.
 *
 * Usage:
 *   <div *hasChannel>Visible only when has a channel</div>
 */
@Directive({
  selector: '[hasChannel]',
  standalone: true,
})
export class HasChannelDirective {
  /** Template reference for the content to be conditionally rendered */
  private templateRef = inject(TemplateRef<any>);

  /** View container for managing the embedded view */
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    // Inject the channel service to access current channel
    const activeChannel = inject(ChannelService).channel;

    effect(() => {
      // Check if channel exists
      if (activeChannel()) {
        // Render the template view if channel exists
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        // Clear the view container if channel doesn't exist
        this.viewContainerRef.clear();
      }
    });
  }
}
