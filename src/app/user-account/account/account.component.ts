import { Component, inject, OnInit } from '@angular/core';
import { Authentication } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { AccountConfigComponent } from './account-config/account-config.component';
import { AccountUpdateComponent } from './account-update/account-update.component';
import { UserPasswordComponent } from './user-password/user-password.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    AccountUpdateComponent,
    AccountConfigComponent,
    UserUpdateComponent,
    UserPasswordComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  account: Authentication;

  // readonly dialog = inject(MatDialog);
  private authService = inject(AuthenticationService);

  ngOnInit(): void {
    this.authService.identity().subscribe((account) => {
      this.account = account;
      console.log(account);
    });
  }

  certificationRequest() {
    // const dialogRef = this.dialog.open(AccountCertificationRequest, {
    //   disableClose: true,
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
    // dialogRef.componentInstance.login = this.account.login;
    // dialogRef.afterClosed().subscribe(res => res && this.accountService.identity(true).subscribe(account => (this.account=account)));
  }
}
