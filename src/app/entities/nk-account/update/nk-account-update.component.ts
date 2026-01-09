import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { IAccount } from 'app/entities/models/nk-account.model';
import { IConfig } from 'app/entities/models/nk-config.model';
import { ConfigService } from 'app/entities/nk-config/service/nk-config.service';
import { IUser } from 'app/entities/user/user.model';
import dayjs from 'dayjs/esm';
import { AccountService } from '../nk-account.service';

@Component({
  standalone: true,
  selector: 'app-nk-account-update',
  templateUrl: './nk-account-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class NkAccountUpdateComponent implements OnInit {
  isSaving = false;
  nkAccount: IAccount | null = null;
  accessibilityValues = Object.keys(Accessibility);

  configurationsCollection: IConfig[] = [];
  usersSharedCollection: IUser[] = [];

  protected nkAccountService = inject(AccountService);
  protected configService = inject(ConfigService);
  protected activatedRoute = inject(ActivatedRoute);
  protected fb = inject(FormBuilder);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm = this.fb.group({
    id: [null],
    name: [null, [Validators.required, Validators.minLength(3)]],
    avatar: [null],
    banner: [null],
    visibility: [Visibility.PRIVATE],
    createdAt: [null],
    configuration: [null],
    user: [null],
  })

  // compareConfig = (o1: IConfig | null, o2: IConfig | null): boolean => this.configService.compareConfig(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nkAccount }) => {
      this.nkAccount = nkAccount;
      if (nkAccount) {
        this.updateForm(nkAccount);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    // this.isSaving = true;
    const rawNkAccount = this.editForm.getRawValue();
    const nkAccount: IAccount = {
      ...rawNkAccount,
      createdAt: dayjs(rawNkAccount.createdAt, DATE_TIME_FORMAT),
    }
    if (nkAccount.id !== null) {
      this.subscribeToSaveResponse(this.nkAccountService.update(nkAccount));
    } else {
      this.subscribeToSaveResponse(this.nkAccountService.create(nkAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccount>>): void {
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

  protected updateForm(nkAccount: IAccount): void {
    this.nkAccount = nkAccount;
    // this.editForm.reset({...nkAccount});

    // this.nkAccountFormService.resetForm(this.editForm, nkAccount);
    // this.configurationsCollection = this.configService.addConfigToCollectionIfMissing<IConfig>(
    //   this.configurationsCollection,
    //   nkAccount.configuration,
    // );
  }

  protected loadRelationshipsOptions(): void {
    // this.configService
    //   .query({ filter: 'ngelmakaccount-is-null' })
    //   .pipe(map((res: HttpResponse<IConfig[]>) => res.body ?? []))
    //   .pipe(
    //     map((configs: IConfig[]) =>
    //       this.configService.addConfigToCollectionIfMissing<IConfig>(configs, this.nkAccount?.configuration),
    //     ),
    //   )
    //   .subscribe((configs: IConfig[]) => (this.configurationsCollection = configs));
  }
}
