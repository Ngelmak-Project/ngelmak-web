import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IAccount } from 'app/entities/models/nk-account.model';
import { ChannelService } from 'app/entities/nk-account/nk-account.service';
import { flashBoxShadow2000ms } from 'app/shared/animations/flash.animation';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './account-update.component.html',
  styleUrl: './account-update.component.scss',
  animations: [flashBoxShadow2000ms],
})
export class AccountUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(ChannelService);
  user = inject(AuthenticationService).authentication;
  account = inject(ChannelService).account;
  isSaving = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  accountForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.accountForm.patchValue(this.account());
  }

  save() {
    this.isSaving.set(true);
    this.flashBoxShadowState = true;
    const account: IAccount = this.accountForm.value as IAccount;
    this.accountService
      .update(account)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe();
  }
}
