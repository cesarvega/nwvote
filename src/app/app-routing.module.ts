import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { LoginComponent } from './auth/login/login.component';
import { BsrMobileComponent } from './bsr-mobile/bsr-mobile.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { BsrComponent } from './bsr/bsr.component';
import { NW3Component } from './nw3/nw3.component';
import { BmxComponent } from './bmx/bmx.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { OrderDasboardComponent } from './restaurant/order-dasboard/order-dasboard.component';
import { EliteComponent } from './elite/elite.component';

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
  // {// SCHEDULER
  //   path: ':id',
  //   component: SchedulerComponent
  // },
  // {//BSR
  //   path: ':id',
  //   component: BsrComponent
  // },
  // {//BI BRAND MATRIX
  //   path: ':id',
  //   component: BsrComponent
  // },
  // {//BI BRAND MATRIX
  //   path: ':id',
  //   component: BmxComponent
  // },
  // {//NW 3 BI PRESENTS NOMENCLATURE WORKSHOP V.3.0
  //   path: ':id',
  //   component: NW3Component
  // },
  // {//FOOD
  //   path: 'orders',
  //   component: OrderDasboardComponent
  // },
  // {//ELITE
  //   path: ':id',
  //   component: RestaurantComponent
  // },
  {//ELITE CESAR
    path: ':id',
    component: EliteComponent
  },
  
  {
    path: '',
    redirectTo: '/1',
    pathMatch: 'full'
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
