import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import SharedModule from "app/shared/shared.module";

import { Authentication } from "app/core/auth/auth.model";
import { PrivilegeService } from "app/entities/nk-privilege/service/nk-privilege.service";
import { AlertService } from "app/shared/alert/alert.service";

@Component({
  standalone: true,
  selector: "app-user-mgmt-detail",
  templateUrl: "./user-management-detail.component.html",
  imports: [RouterModule, SharedModule],
})
export default class UserManagementDetailComponent {
  route = inject(ActivatedRoute);
  // readonly dialog = inject(MatDialog);
  private privilegeService: PrivilegeService = inject(PrivilegeService);
  private alertService: AlertService = inject(AlertService);

  privileges: any[] = [];
  account: Authentication | null = null;
  isRevoking = signal(false);

  ngOnInit(): void {
    this.account = this.route.snapshot.data["account"];
    this.loadPrivileges();
  }

  loadPrivileges() {
    this.privilegeService
      .findByLogin(this.account.login)
      .subscribe((res: any) => (this.privileges = res.body));
  }

  grant() {
    // const dialogRef = this.dialog.open(PrivilegeGrantComponent, {
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
    // dialogRef.componentInstance.login = this.account.login;

    // dialogRef
    //   .afterClosed()
    //   .subscribe((privilege: IPrivilege) => this.loadPrivileges());
  }

  certificate() {
    // const dialogRef = this.dialog.open(CertificationComponent, {
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
    
    // dialogRef.componentInstance.login = this.account.login;

    // dialogRef
    //   .afterClosed()
    //   .subscribe((account: Authentication) => (this.account = account || this.account));
  }

  uncertificate() {
    // const dialogRef = this.dialog.open(CertificationResetComponent, {
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
    // dialogRef.componentInstance.login = this.account.login;

    // dialogRef
    //   .afterClosed()
    //   .subscribe((account: Authentication) => (this.account = account || this.account));
  }

  revoke(id: number) {
    this.isRevoking.set(true);
    this.privilegeService.revoke(id).subscribe({
      next: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "success", message: "Le privilège est retiré à l'utilisateur." });
        this.loadPrivileges();
      },
      error: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "error", message: "Une erreur s'est produite." });
      },
    });
  }

  assign(id: number) {
    this.isRevoking.set(true);
    this.privilegeService.assign(id).subscribe({
      next: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "success", message: "Privilège attribuée avec succès !" });
        this.loadPrivileges();
      },
      error: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "error", message: "Une erreur s'est produite." });
      },
    });
  }

  activate(id: number) {
  }

  previousState(): void {
    window.history.back();
  }
}
