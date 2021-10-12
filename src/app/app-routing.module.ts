import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { LoginComponent } from './auth/login/login.component';
import { BsrMobileComponent } from './bsr-mobile/bsr-mobile.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { BsrComponent } from './bsr/bsr.component';
import { NW3Component } from './nw3/nw3.component';
import { BmxCreatorComponent } from './bmx/bmx-creator/bmx-creator.component';
import { BmxComponent } from './bmx/bmx-survey/bmx.component';
import { SurveyMatrixComponent } from './bmx/bmx-creator/survey-matrix/survey-matrix.component';
// import { BmxCreatorComponent } from './bmx-creator/bmx-creator.component';

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
  // {//BSR  color of the bar #002f5b
  //   path: ':id',
  //   component: BsrComponent
  // },
  {//BI BRAND MATRIX CREATOR
  path: ':id/:username',
   component: BmxCreatorComponent
  },
   {//BI BRAND MATRIX
    path: 'bmx/:id/:username',
    component: SurveyMatrixComponent
  },
  // {//NW 3 BI PRESENTS NOMENCLATURE WORKSHOP V.3.0
  //   path: ':id',
  //   component: NW3Component
  // },
  {
    path: '',
    redirectTo: '/Blend/bi_cvega',
    pathMatch: 'full'
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
