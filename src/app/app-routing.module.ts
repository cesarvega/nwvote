import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { LoginComponent } from './auth/login/login.component';
import { BsrMobileComponent } from './bsr-mobile/bsr-mobile.component';
import { BsrComponent } from './bsr/bsr.component';
import { NW3Component } from './nw3/nw3.component';
import { BmxComponent } from './bmx/bmx.component';

const routes: Routes = [
  // {// NAME VOTE LOGIN https://bipresents.com/namevote/login?project=Test_WELL_PLATFORM
  //   path: 'login',
  //   component: LoginComponent
  // },
  // {// VOTE COMPONENT 
  //   path: 'vote',
  //   component: NwVoteComponent
  // },
  // {// BSR-Mobile http://mynamepage.com/te2687
  //   path: ':id',
  //   component: BsrMobileComponent
  // },
  // {//BSR
  //   path: ':id',
  //   component: BsrComponent
  // },
  // {//BI BRAND MATRIX
  //   path: ':id',
  //   component: BmxComponent
  // },
  {//NW 3 BI PRESENTS NOMENCLATURE WORKSHOP V.3.0
    path: ':id',
    component: NW3Component
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
