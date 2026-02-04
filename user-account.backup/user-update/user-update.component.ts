import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { flashBoxShadow2000ms } from 'app/shared/animations/flash.animation';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.scss',
  animations: [flashBoxShadow2000ms],
})
export class UserUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  isSaving = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  accountForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(1)]],
    lastName: ['', [Validators.required, Validators.minLength(1)]],
    login: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(
          '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$',
        ),
      ],
    ],
    email: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    ],
  });

  account = inject(AuthenticationService).authentication;

  ngOnInit(): void {
    this.accountForm.patchValue(this.account());
  }

  save(): void {
    this.isSaving.set(true);
    const account = this.accountForm.value as Authentication;
    // this.authService.save(account).pipe(finalize(() => (this.isSaving.set(false)))).subscribe(() => (this.authService.authenticate(account)));
  }
}
