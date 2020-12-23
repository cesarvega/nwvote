import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { LoginComponent } from './auth/login/login.component';
import { BsrMobileComponent } from './bsr-mobile/bsr-mobile.component';
import { BsrComponent } from './bsr/bsr.component';

const routes: Routes = [
  // {
  //   path: 'login',
  //   component: LoginComponent
  // },
  // {
  //   path: 'vote',
  //   component: NwVoteComponent
  // },
  {// BSR-Mobile New Devices
    path: ':id',

    component: BsrMobileComponent
  },
  // {//BSR
  //   path: ':id',
  //   component: BsrComponent
  // },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
