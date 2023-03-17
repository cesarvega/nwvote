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
  // {// BSR-Mobile https://mynamepage.com/te2687
  //   path: ':id',
  //   component: BsrMobileComponent
  // },
  // {// SCHEDULER
  //   path: ':id',
  //   component: SchedulerComponent
  // },
  // {//BSR  color of the bar #002f5b  https://www.bipresents.com/pa3930
  //   path: ':id',
  //   component: BsrComponent
  // },
  {//BI BRAND MATRIX CREATOR
  // path: ':id/:biUsername',
  path: 'bmx/:id',
   component: BmxCreatorComponent
  },
   {//BI BRAND MATRIX SURVEY
    path: 'survey/:id/:username',
    component: SurveyMatrixComponent
  },
   {//BI BRAND MATRIX SURVEY WITH GUI
    path: ':id',
    component: SurveyMatrixComponent
  },

  // {//NW 3 BI PRESENTS NOMENCLATURE WORKSHOP V.3.0
  //   path: ':id',
  //   component: NW3Component
  // },
  {
    path: '',
    // redirectTo: '/',
    //redirectTo: 'bmx/99CB72BF-D163-46A6-8A0D-E1531EC7FEDC', // creative
    redirectTo: 'bmx/E9096C9-084F-4D10-81C2-C72B70E5D782', // admin
    // redirectTo: 'survey/noProject/no_user',
    // redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// http://bmcreator2.brandinstitute.com/survey/ImageStarRate/guest

// http://bmcreator2.brandinstitute.com/survey/ImageStarRateCriteria/guest

// http://bmcreator2.brandinstitute.com/survey/rateEstrella/guest

// http://bmcreator2.brandinstitute.com/survey/StartRateCriteria/guest

// http://bmcreator2.brandinstitute.com/survey/TopRankDragAndDrop/guest

// http://bmcreator2.brandinstitute.com/survey/TopRankDropDown/guest

// http://bmcreator2.brandinstitute.com/survey/TopRankRadio/guest

// http://bmcreator2.brandinstitute.com/survey/MiltipleChoice/guest

// http://bmcreator2.brandinstitute.com/survey/MultipleChoiceWithComments/guest

// http://bmcreator2.brandinstitute.com/survey/NarrowDown/guest

// http://bmcreator2.brandinstitute.com/survey/NarrowDownCriteria/guest

// http://bmcreator2.brandinstitute.com/survey/SpecialRequestLogos/guest

// http://bmcreator2.brandinstitute.com/survey/Tinder/guest
