import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SurveyMatrixComponent } from './survey-matrix/survey-matrix.component';
import { SurveyCreationDesignComponent } from './survey-creation-design/survey-creation-design.component';
import { RespondentsComponent } from './respondents/respondents.component';
import { ProjectReportsComponent } from './project-reports/project-reports.component';
import { ProjectListComponent } from './dashboard/project-list/project-list.component';
import { ProjectInformationComponent } from './project-information/project-information.component';
import { ParticipantsEmailComponent } from './participants-email/participants-email.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { BmxSurveyComponent } from './bmx-survey/bmx-survey.component';
import { HeaderComponent } from './dashboard/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BmxService } from './service/bmx.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardMenuComponent } from './dashboard/dashboard-menu/dashboard-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    SurveyMatrixComponent,
    SurveyCreationDesignComponent,
    RespondentsComponent,
    ProjectReportsComponent,
    ProjectListComponent,
    ProjectInformationComponent,
    ParticipantsEmailComponent,
    ImageUploaderComponent,
    BmxSurveyComponent,
    HeaderComponent,
    DashboardComponent,
    DashboardMenuComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [BmxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
