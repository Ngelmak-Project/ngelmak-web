import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import entityRoutes from 'app/entities/entity.routes';
import HomeComponent from 'app/home/home.component';
import pageRoutes from 'app/pages/page.routes';
import userAccountRoutes from 'app/user-account/user-account.routes';
import { errorRoute } from '../error/error.route';
import FooterComponent from '../footer/footer.component';
import NavbarComponent from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import MainComponent from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', title: 'Ngelmak Project', component: HomeComponent },
      // { path: 'search', title: 'Posts', component: PostComponent },
      {
        path: 'admin',
        data: {
          authorities: [Authority.ADMIN],
        },
        canActivate: [UserRouteAccessService],
        loadChildren: () => import('app/admin/admin.routes'),
      },
      ...userAccountRoutes, // default user page management
      ...entityRoutes, // Entity routes.
      ...pageRoutes, // Page routes.
      ...errorRoute, // Error routes.
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
