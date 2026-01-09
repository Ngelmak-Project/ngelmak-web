import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import entityRoutes from 'app/entities/entity.routes';
import { PostComponent } from 'app/entities/nk-post/list/nk-post.component';
import UserAccountComponent from 'app/user-account/user-account.component';
import FooterComponent from '../footer/footer.component';
import NavbarComponent from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import MainComponent from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', title: 'Posts', component: PostComponent },
      { path: 'search', title: 'Posts', component: PostComponent },
      {
        path: 'ngelmak-administration',
        data: {
          authorities: [Authority.ADMIN],
        },
        canActivate: [UserRouteAccessService],
        loadChildren: () => import('app/admin/admin.routes'),
      },
      {
        path: 'account',
        data: {
          authorities: [Authority.USER],
        },
        canActivate: [UserRouteAccessService],
        component: UserAccountComponent,
      },
      ...entityRoutes, // entities routes
    ],
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  exports: [RouterModule],
})
export class MainModule {}
