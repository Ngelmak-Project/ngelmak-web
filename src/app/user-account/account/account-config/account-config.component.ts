import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from "app/core/auth/auth.service";import { IConfig } from 'app/entities/models/nk-config.model';
;
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'app-account-config',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './account-config.component.html',
  styleUrl: './account-config.component.scss'
})
export class AccountConfigComponent {
  private nkAccountService = inject(AccountService);
  account = inject(AuthenticationService).trackCurrentAuthentication();
  nkAccount = inject(AccountService).trackCurrentAccount();
  isSaving = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  conifgForm = new FormGroup({
    id: new FormControl<number | null>(null),
    defaultAccessibility: new FormControl<string | null>(null, Validators.required),
    defaultVisibility: new FormControl<string | null>(null, Validators.required),
  });
  config: IConfig;

  ngOnInit(): void {
    this.config = this.nkAccount().configuration;
    this.conifgForm.patchValue(this.config);
  }

  save() {
    this.isSaving.set(true);
    this.flashBoxShadowState = true;
    const conifg: IConfig = this.conifgForm.value as IConfig;
    this.nkAccountService.partialUpdate(conifg).subscribe({ complete: () => (this.isSaving.set(false)) });
  }
}
