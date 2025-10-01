import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout/main-layout.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/AuthGuard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout/auth-layout.component';
import { ErrorComponent } from './features/error/error.component';
import { WildcardComponent } from './features/wildcard/wildcard.component';


// const routes: Routes = [
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('./features/auth/auth.module').then(m => m.AuthModule)
//   },
//   { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, // default route
//   { path: '**', redirectTo: '/auth/login' } // wildcard
// ];

const routes: Routes = [
  {
    path: 'auth',

    canActivate: [LoginGuard],

    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/settings-page/settings.module').then(m => m.SettingsModule)
  },

  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'search',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/search/search.module').then(m => m.SearchModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/feed/home.module').then(m => m.HomeModule)
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: WildcardComponent } // wildcard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
