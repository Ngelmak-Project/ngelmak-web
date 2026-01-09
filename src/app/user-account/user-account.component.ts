import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertService } from "./../shared/alert/alert.service";

import { AuthenticationService } from "app/core/auth/auth.service";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { IAccount } from "app/entities/models/nk-account.model";
import { AccountService as NkAccountService } from "app/entities/nk-account/nk-account.service";
import { finalize } from "rxjs";
import { AccountCertificationRequest } from "./account-certification-request/account-certification-request.component";
import { UserUpdateComponent } from "./user-update/user-update.component";

@Component({
  standalone: true,
  selector: "app-user-account",
  templateUrl: "./user-account.component.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserUpdateComponent,
  ],
})
export default class UserAccountComponent implements OnInit {
  // private renderer: Renderer2;

  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);
  // readonly dialog = inject(MatDialog);
  private router = inject(Router);
  private accountService = inject(AuthenticationService);
  private alertService = inject(AlertService);
  // private rootRenderer = inject(RendererFactory2);
  imageSrc = signal(null);
  file: File = null;

  private fb = inject(FormBuilder);
  private nkAccountService = inject(NkAccountService);
  account = inject(AuthenticationService).trackCurrentAuthentication();
  nkAccount = inject(NkAccountService).trackCurrentAccount();
  isSaving = signal(false);
  isUploading = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  nkAccountForm = this.fb.group({
    id: [null],
    name: ["", [Validators.required, Validators.minLength(2)]],
    description: [
      "",
      [Validators.required, Validators.minLength(1), Validators.maxLength(500)],
    ],
  });

  ngOnInit(): void {
    this.nkAccountForm.patchValue(this.nkAccount());
  }

  save() {
    this.isSaving.set(true);
    this.flashBoxShadowState = true;
    const nkAccount: IAccount = this.nkAccountForm.value as IAccount;
    this.nkAccountService
      .update(nkAccount)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe();
  }

  uploadImage() {
    this.isUploading.set(true);
    const data: FormData = new FormData();
    data.append("file", this.file);
    return this.http
      .put(
        this.applicationConfigService.getEndpointFor(
          "api/account/upload-image"
        ),
        data
      )
      .pipe(finalize(() => this.isUploading.set(false)))
      .subscribe({
        next: (result) => {
          this.accountService.authenticate(result);
          this.imageSrc.set(null);
        },
        error: () =>
          this.alertService.addAlert({
            type: "error",
            message: "Une erreur s'est produite lors de la sauvegarde",
          }),
      });
  }

  certificationRequest() {
    // const dialogRef = this.dialog.open(AccountCertificationRequest, {
    //   disableClose: true,
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
  }

  handleImage(event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.imageSrc.set(URL.createObjectURL(this.file));
    }
  }
}
