import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { IAccount } from 'app/entities/models/nk-account.model';
import { IMembership } from 'app/entities/models/nk-membership.model';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import { MembershipService } from '../service/nk-membership.service';
import { MembershipFormGroup, MembershipFormService } from './nk-membership-form.service';

@Component({
  standalone: true,
  selector: 'app-membership-update',
  templateUrl: './nk-membership-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MembershipUpdateComponent implements OnInit {
  isSaving = false;
  membership: IMembership | null = null;

  accountsSharedCollection: IAccount[] = [];

  protected membershipService = inject(MembershipService);
  protected membershipFormService = inject(MembershipFormService);
  protected accountService = inject(AccountService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MembershipFormGroup = this.membershipFormService.createMembershipFormGroup();


  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ membership }) => {
      this.membership = membership;
      if (membership) {
        this.updateForm(membership);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const membership = this.membershipFormService.getMembership(this.editForm);
    if (membership.id !== null) {
      this.subscribeToSaveResponse(this.membershipService.update(membership));
    } else {
      this.subscribeToSaveResponse(this.membershipService.create(membership));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMembership>>): void {
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

  protected updateForm(membership: IMembership): void {
    // this.membership = membership;
    // this.membershipFormService.resetForm(this.editForm, membership);

    // this.accountsSharedCollection = this.accountService.addAccountToCollectionIfMissing<IAccount>(
    //   this.accountsSharedCollection,
    //   membership.account,
    //   membership.subscriber,
    // );
  }

  protected loadRelationshipsOptions(): void {
    // this.accountService
    //   .query()
    //   .pipe(map((res: HttpResponse<IAccount[]>) => res.body ?? []))
    //   .pipe(
    //     map((accounts: IAccount[]) =>
    //       this.accountService.addAccountToCollectionIfMissing<IAccount>(
    //         accounts,
    //         this.membership?.account,
    //         this.membership?.subscriber,
    //       ),
    //     ),
    //   )
    //   .subscribe((accounts: IAccount[]) => (this.accountsSharedCollection = accounts));
  }
}
