import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactMessageService } from 'app/entities/nk-contact-message/nk-contact-message.service';
import { ContactMessageUpdateComponent } from 'app/entities/nk-contact-message/update/nk-contact-message-update.component';

import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import SharedModule from 'app/shared/shared.module';

import { HttpResponse } from '@angular/common/http';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { IPage } from 'app/shared/pagination/pagination.model';
import { ContactMessageItemComponent } from './item/nk-contact-message-item.component';
import { IContactMessageDTO } from 'app/entities/models/nk-contact-message.model';

@Component({
  standalone: true,
  selector: 'app-contact-message',
  templateUrl: './nk-contact-message.component.html',
  imports: [RouterModule, FormsModule, SharedModule, ContactMessageUpdateComponent, ContactMessageItemComponent],
})
export class ContactMessageComponent implements OnInit {
  post = input.required<IPostDTO>();
  postSig = signal<IPostDTO>(null);

  contactMessages = signal<IContactMessageDTO[]>([]);
  hasNext = signal(false);
  isLoading = signal(false);
  protected contactMessageService = inject(ContactMessageService);

  itemsPerPage = ITEMS_PER_PAGE;
  pageToLoad = 1;

  ngOnInit(): void {
    this.postSig.set(this.post());

    this.loadAll();
  }

  loadAll(): void {
    this.isLoading.set(true);
    const req = {
      page: this.pageToLoad - 1,
      size: this.itemsPerPage,
    };
    this.contactMessageService.findUntreatedContactMessage(req).subscribe({
      next: (res: HttpResponse<IPage<IContactMessageDTO>>) => {
        const { body } = res;
        this.hasNext.set((body.size == body.size));
        this.contactMessages.set(body.content ?? []);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  /**
   * Removes a deleted contactMessage from the local contactMessage list and updates
   * the post's contactMessage count accordingly.
   *
   * This method is typically called after the API confirms that a contactMessage
   * has been successfully deleted on the server.
   *
   * @param deleteContactMessage - The contactMessage object returned by the delete action,
   *                        containing at least the ID of the removed contactMessage.
   */
  onDeleted(deleteContactMessage: IContactMessageDTO) {
    // Decrement the total contactMessage count for the post
    // this.postSig.update((p) => ({ ...p, contactMessageCount: p.contactMessageCount - 1 }));
    // Update the reactive contactMessages signal with the new list
    this.contactMessages.update((list) => list.filter((c) => c.id !== deleteContactMessage.id));
  }

  /**
   * Adds a newly created contactMessage to the contactMessage list and updates
   * the post's contactMessage count.
   *
   * @param newContactMessage - The freshly created contactMessage returned by the server.
   */
  onContactMessage(newContactMessage: IContactMessageDTO) {
    // Increase the total number of contactMessages on the post
    // this.postSig.update((p) => ({ ...p, contactMessageCount: p.contactMessageCount + 1 }));
    // end the new contactMessage to the current list
    this.contactMessages.update((list) => [...list, newContactMessage]);
  }
}
