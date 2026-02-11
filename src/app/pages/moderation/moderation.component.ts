import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { UserService } from 'app/user-management/security/user.service';
import { finalize } from 'rxjs';

interface AuthorityRequestDTO {
  id?: number;
  authority?: Authority;
  motivation?: string;
  status?: string;
  requestedAt?: Date;
}

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  imports: [CommonModule, RouterModule, SharedModule, Field],
})
export class ModerationComponent {
  user = inject(AuthenticationService).authentication;
  userSerive = inject(UserService);
  alertService = inject(AlertService);

  authRequestModel = signal({
    authorityName: Authority.MODERATOR,
    motivation: '',
  });

  authorityForm = form(this.authRequestModel, (p) => {
    required(p.motivation);
    maxLength(p.motivation, 500);
  });

  authRequest = signal<AuthorityRequestDTO>(undefined);
  isSaving = signal(false);

  constructor() {
    effect(() => this.user() && this.loadAll());
  }

  loadAll(): void {
    this.userSerive.findRequestedAuthorities().subscribe((authorities: AuthorityRequestDTO[]) => {
      authorities
        .filter((auth) => auth.authority == Authority.MODERATOR)
        .forEach((auth) => this.authRequest.set(auth));
    });
  }

  request(): void {
    this.isSaving.set(true);
    this.userSerive
      .requestAuthority(this.authRequestModel().authorityName, this.authRequestModel().motivation)
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        }),
      )
      .subscribe(() => {
        this.loadAll();
        this.authRequestModel.set({
          authorityName: Authority.MODERATOR,
          motivation: '',
        });
        this.alertService.addAlert({
          type: 'success',
          translationKey: 'moderation.request.success',
          message: 'Votre demande de modérateur a été envoyée avec succès.',
        });
      });
  }
}
