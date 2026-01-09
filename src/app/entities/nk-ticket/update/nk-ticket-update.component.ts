import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { TicketType } from 'app/entities/enumerations/ticket-type.model';
import { IComment } from 'app/entities/models/nk-comment.model';
import { IPost } from 'app/entities/models/nk-post.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { IAlert } from 'app/shared/alert/alert.service';
import { TicketService } from '../service/nk-ticket.service';
import { TicketFormGroup, TicketFormService } from './nk-ticket-form.service';

@Component({
  standalone: true,
  selector: 'app-ticket-update',
  templateUrl: './nk-ticket-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;
  ticket: ITicket | null = null;
  ticketTypeValues = Object.keys(TicketType);

  postsSharedCollection: IPost[] = [];
  commentsSharedCollection: IComment[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected ticketService = inject(TicketService);
  protected ticketFormService = inject(TicketFormService);
  protected postService = inject(PostService);
  protected commentService = inject(CommentService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketFormGroup = this.ticketFormService.createTicketFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.ticket = ticket;
      if (ticket) {
        this.updateForm(ticket);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<IAlert>('ngelmakprojectApp.error', {type: "error"})),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticket = this.ticketFormService.getTicket(this.editForm);
    if (ticket.id !== null) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ticket: ITicket): void {
    this.ticket = ticket;
    this.ticketFormService.resetForm(this.editForm, ticket);

    // this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, ticket.postRelated);
    // this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing<IComment>(
    //   this.commentsSharedCollection,
    //   ticket.commentRelated,
    // );
    // this.nkAccountsSharedCollection = this.nkAccountService.addNkAccountToCollectionIfMissing<IAccount>(
    //   this.nkAccountsSharedCollection,
    //   ticket.accountRelated,
    //   ticket.issuedby,
    // );
  }

  protected loadRelationshipsOptions(): void {
    // this.postService
    //   .query()
    //   .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
    //   .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.ticket?.postRelated)))
    //   .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));

    // this.commentService
    //   .query()
    //   .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
    //   .pipe(
    //     map((comments: IComment[]) => this.commentService.addCommentToCollectionIfMissing<IComment>(comments, this.ticket?.commentRelated)),
    //   )
    //   .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));

    // this.nkAccountService
    //   .query()
    //   .pipe(map((res: HttpResponse<IAccount[]>) => res.body ?? []))
    //   .pipe(
    //     map((nkAccounts: IAccount[]) =>
    //       this.nkAccountService.addNkAccountToCollectionIfMissing<IAccount>(
    //         nkAccounts,
    //         this.ticket?.accountRelated,
    //         this.ticket?.issuedby,
    //       ),
    //     ),
    //   )
    //   .subscribe((nkAccounts: IAccount[]) => (this.nkAccountsSharedCollection = nkAccounts));
  }
}
