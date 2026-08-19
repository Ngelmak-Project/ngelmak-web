import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Field, form, maxLength } from '@angular/forms/signals';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { UserUpdateDTO } from '../user.model';
import { UserService } from '../user.service';
import { LANGUAGES } from 'app/config/language.constants';

@Component({
  selector: 'app-security-profile',
  templateUrl: './app-security-profile.component.html',
  imports: [CommonModule, Field, SharedModule],
})
export class SecurityProfileComponent {
  user = inject(AuthenticationService).authentication;
  authenticationService = inject(AuthenticationService);

  alertService = inject(AlertService);
  userService = inject(UserService);
  editPersonalInfo = signal(false);

  isUploading = signal(false);
  isSaving = signal(false);

  hideLangKeyOptions = signal(true);

  userModel = signal<UserUpdateDTO>({
    firstName: '',
    lastName: '',
    langKey: 'fr',
    darkModeEnabled: null,
  });

  userForm = form(this.userModel, (p) => {
    maxLength(p.firstName, 50, { message: 'Maximum 50 caractères' });
    maxLength(p.lastName, 50, { message: 'Maximum 50 caractères' });
    maxLength(p.langKey, 5, { message: 'Maximum 5 caractères' });
  });

  // Preview file before upload
  filePreview = signal<{ data: File; url: string } | null>(null);
  languages = LANGUAGES;

  constructor() {
    effect(() => {
      this.userModel.set(this.user());
    });
  }

  /**
   * Handle file selection for avatar or banner.
   */
  handleImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const data = input.files?.[0];

    if (!data) return;

    const preview = {
      data,
      url: URL.createObjectURL(data),
    };

    this.filePreview.set(preview);
  }

  selectLang(langKey: string) {
    // Recommended update pattern
    this.userModel.update((currentModel) => ({
      ...currentModel,
      langKey: langKey,
    }));
    this.hideLangKeyOptions.set(true);
  }

  updateProfile() {
    this.isSaving.set(true);
    const userUpdate = this.userModel();
    this.userService
      .update(userUpdate)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: ({ body }) => {
          // Update user profil info.
          this.authenticationService.authenticate(body);
          this.editPersonalInfo.set(false);
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            translationKey: 'ngelmakTranslation.userManagement.security.profile.alerts.updateError',
            message: "Une erreur s'est produite lors de la mise à jour.",
          }),
      });
  }

  /**
   * Upload avatar or banner depending on the current editing type.
   */
  upload() {
    const preview = this.filePreview();
    if (!preview) return;

    this.isUploading.set(true);

    this.userService
      .uploadImage(preview.data)
      .pipe(
        finalize(() => {
          this.isUploading.set(false);
          this.cancelEdit();
        })
      )
      .subscribe({
        next: (res) => {
          // this.user.updateLocalAccount(res.body);
          // Cleanup
          URL.revokeObjectURL(preview.url);
          this.filePreview.set(null);
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            translationKey: 'ngelmakTranslation.userManagement.security.profile.alerts.updateError',
            message: "Une erreur s'est produite lors de la mise à jour.",
          }),
      });
  }

  /**
   * Cancel editing and cleanup preview.
   */
  cancelEdit() {
    const preview = this.filePreview();
    if (preview) URL.revokeObjectURL(preview.url);

    this.filePreview.set(null);
  }

  formatLang(langKey: string) {
    const lang = this.languages.find((l) => l.code === langKey);
    return lang ? `${lang.flag} ${lang.label}` : '—';
  }
}
