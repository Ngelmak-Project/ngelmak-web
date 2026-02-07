import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountDetailComponent } from '../../entities/nk-account/detail/nk-account-detail.component';

@Component({
  standalone: true,
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  imports: [CommonModule, RouterModule, AccountDetailComponent],
})
export class AccountPageComponent {}
