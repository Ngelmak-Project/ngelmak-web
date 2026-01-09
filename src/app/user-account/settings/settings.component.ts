import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { LANGUAGES } from 'app/config/language.constants';
import { Authentication } from 'app/core/auth/auth.model';
import { AuthenticationService } from "app/core/auth/auth.service";
import SharedModule from 'app/shared/shared.module';
;

const initialAuth: Authentication = {} as Authentication;

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  success = signal(false);
  languages = LANGUAGES;

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAuth.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAuth.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAuth.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAuth.langKey, { nonNullable: true }),

    activated: new FormControl(initialAuth.activated, { nonNullable: true }),
    authorities: new FormControl(initialAuth.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAuth.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAuth.login, { nonNullable: true }),
  });

  private accountService: AuthenticationService = inject(AuthenticationService);

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });
  }

  save(): void {
    this.success.set(false);

    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success.set(true);

      this.accountService.authenticate(account);
    });
  }
}
