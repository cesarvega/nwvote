import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { LoginComponent } from './auth/login/login.component';
import { BsrMobileComponent } from './bsr-mobile/bsr-mobile.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { BsrComponent } from './bsr/bsr.component';
import { NW3Component } from './nw3/nw3.component';

import { DashboardComponent } from './bmx/components/dashboard/dashboard.component';
import { ProjectInformationComponent } from './bmx/components/project-information/project-information.component';
import { SurveyCreationDesignComponent } from './bmx/components/bmx-creator/survey-creation-design/survey-creation-design.component';
import { ParticipantsEmailComponent } from './bmx/components/participants-email/participants-email.component';
import { ProjectReportsComponent } from './bmx/components/project-reports/project-reports.component';
import { RespondentsComponent } from './bmx/components/respondents/respondents.component';
// import { BmxCreatorComponent } from './bmx-creator/bmx-creator.component';
const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'bmx-creation', component:SurveyCreationDesignComponent },
  {path: 'project-information', component: ProjectInformationComponent},
  {path: 'participants', component: RespondentsComponent },
  {path: 'reports', component: ProjectReportsComponent},
  {path: 'participants-emails',component: ParticipantsEmailComponent},
  // {path: 'login', component: LoginComponent},
  {path: 'signout', component: LoginComponent},
  { path: '**', redirectTo: 'dashboard/99CB72BF-D163-46A6-8A0D-E1531EC7FEDC' },
 
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

