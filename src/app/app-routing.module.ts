import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { LoginComponent } from './auth/login/login.component';
import { BsrMobileComponent } from './bsr-mobile/bsr-mobile.component';
import { BsrComponent } from './bsr/bsr.component';
import { MobileComponent } from './mobile/mobile.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'mobile',
    component: MobileComponent
  },
  {
    path: 'vote',
    component: NwVoteComponent
  },
  {
    path: 'bsr-mobile/:id',

    component: BsrMobileComponent
  },
  {
    path: 'bsr/:id',
    component: BsrComponent
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
