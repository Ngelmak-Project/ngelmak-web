import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import adminRoutes from 'app/admin/admin.routes';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import entityRoutes from 'app/entities/entity.routes';
import HomeComponent from 'app/home/home.component';
import { errorRoute } from 'app/layouts/error/error.route';
import FooterComponent from 'app/layouts/footer/footer.component';
import NavbarComponent from 'app/layouts/navbar/navbar.component';
import { SidebarComponent } from 'app/layouts/sidebar/sidebar.component';
import pageRoutes from 'app/pages/page.routes';
import userManagementRoutes from 'app/user-management/user-management.routes';
import MainComponent from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('app/home/home.routes'),
      },
      {
        path: 'admin',
        data: {
          authorities: [Authority.ADMIN],
        },
        canActivate: [UserRouteAccessService],
        loadChildren: () => import('app/admin/admin.routes'),
      },
      ...userManagementRoutes, // default user page management
      ...entityRoutes, // Entity routes.
      ...pageRoutes, // Page routes.
      ...adminRoutes, // Admin routes.
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
