import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { NwvoteService } from './nw-vote/nwvote.service';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { BsrMobileComponent, editName } from './bsr-mobile/bsr-mobile.component';
import { BsrMobileService } from './bsr-mobile/bsr-mobile.service';
import { BsrComponent, editPost } from './bsr/bsr.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
// import { CKEditorModule } from 'ckeditor4-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {  MatSelectModule } from '@angular/material/select';
import { QRCodeModule } from 'angularx-qrcode';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NW3Component } from './nw3/nw3.component';
import { Nw3Service } from './nw3/nw3.service';
import { HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { SchedulerComponent } from './scheduler/scheduler.component';
// import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {  MatProgressBarModule } from '@angular/material/progress-bar';
import { DragulaModule } from 'ng2-dragula';
import {  MatListModule } from '@angular/material/list';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {  MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {  MatRadioModule } from '@angular/material/radio';
import { CdkTableModule } from '@angular/cdk/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { A11yModule } from '@angular/cdk/a11y';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { MenuComponent } from './bmx/components/menu/menu.component';
import { DashboardComponent } from './bmx/components/dashboard/dashboard.component';
import { ParticipantsEmailComponent } from './bmx/components/participants-email/participants-email.component';
import { ProjectInformationComponent } from './bmx/components/project-information/project-information.component';
import { DialogComponent } from './bmx/components/participants-email/dialog/dialog.component';
import { RespondentsComponent } from './bmx/components/respondents/respondents.component';
import { ProjectReportsComponent } from './bmx/components/project-reports/project-reports.component';
import { ProjectListComponent } from './bmx/components/project-list/project-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {DocxSurveyComponent} from './bmx/components/docx-survey/docx-survey.component'
import {BmxComponent} from './bmx/components/bmx-survey/bmx.component'
import {BmxCreatorComponent} from './bmx/components/bmx-creator/bmx-creator.component'
import {SurveyCreationDesignComponent} from './bmx/components/bmx-creator/survey-creation-design/survey-creation-design.component'
import {SurveyMatrixComponent} from './bmx/components/bmx-creator/survey-matrix/survey-matrix.component'
import {ImageUploaderComponent} from './bmx/components/bmx-creator/image-uploader/image-uploader.component'
import {PageLineBreakComponent} from './bmx/components/project-reports/templates/page-line-break/page-line-break.component'
import {PageTitleComponent} from './bmx/components/project-reports/templates/page-title/page-title.component'
import {ReportFirstPageComponent} from './bmx/components/project-reports/templates/report-first-page/report-first-page.component'

import {LogoHeaderComponent} from './bmx/components/bmx-creator/survey-creation-design/templates/logo-header/logo-header.component'
import {NarrowDownComponent} from './bmx/components/bmx-creator/survey-creation-design/templates/narrow-down/narrow-down.component'
import {QuestionAnswerComponent} from './bmx/components/bmx-creator/survey-creation-design/templates/question-answer/question-answer.component'
import {RankScaleComponent} from './bmx/components/bmx-creator/survey-creation-design/templates/rank-scale/rank-scale.component'
import {RatingScaleComponent} from './bmx/components/bmx-creator/survey-creation-design/templates/rating-scale/rating-scale.component'
import {TextParagraphComponent} from './bmx/components/bmx-creator/survey-creation-design/templates/text-paragraph/text-paragraph.component'
import {TinderComponent} from './bmx/components/bmx-creator/survey-creation-design/templates/tinder/tinder.component'
import {SafePipe} from './bmx/components/bmx-creator/safe.pipe';
import { SurveyDialogComponent } from './bmx/components/survey-dialog/survey-dialog.component';
import { ProjectListCheckComponent } from './bmx/components/project-list-check/project-list-check.component'
import {TemplatesComponent} from './bmx/components/templates/templates.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from './bmx/components/table/table.component';
// import { TinderComponent } from './bmx/bmx-creator/survey-creation-design/templates/tinder/tinder.component';
import { ImageRankDragComponent } from './bmx/components/bmx-creator/survey-creation-design/templates/image-rank-drag/image-rank-drag.component';
import { ImageRateScaleComponent } from './bmx/components/bmx-creator/survey-creation-design/templates/image-rate-scale/image-rate-scale.component';
import { ImageRankComponent } from './bmx/components/bmx-creator/survey-creation-design/templates/image-rank/image-rank.component';
import { SignalComponent } from './signal/signal.component';
import { LoaderComponent } from './bmx/components/loader/loader.component';
import { QuillModule } from 'ngx-quill';

export function loadEcharts() {
  return import('echarts');
}


export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'fbcbd5db-c816-4ffb-8310-316cf7781c45',
      authority: 'https://login.microsoftonline.com/f010ce16-e13d-4c24-87af-3a1eb4d11de6',
      redirectUri: 'http://localhost:4200',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  });
}
@NgModule({
    declarations: [
        AppComponent,
        // LoginComponent,
        NwVoteComponent,
        BsrMobileComponent,
        editName,
        editPost,
        SafePipe,
        BsrComponent,
        NW3Component,
        BmxComponent,
        SchedulerComponent,
        DashboardComponent,
        DialogComponent,
        MenuComponent,
        ParticipantsEmailComponent,
        ProjectInformationComponent,
        RespondentsComponent,
        ParticipantsEmailComponent,
        ProjectReportsComponent,
        ProjectListComponent,
        DocxSurveyComponent,
        BmxComponent,
        // BmxCreatorComponent,
        SurveyCreationDesignComponent,
        SurveyMatrixComponent,
        ImageUploaderComponent,
        PageLineBreakComponent,
        PageTitleComponent,
        ReportFirstPageComponent,
        ImageRankComponent,
        ImageRankDragComponent,
        ImageRateScaleComponent,
        LogoHeaderComponent,
        NarrowDownComponent,
        QuestionAnswerComponent,
        RankScaleComponent,
        RatingScaleComponent,
        TextParagraphComponent,
        TinderComponent,
        SurveyDialogComponent,
        TableComponent,
        ProjectListCheckComponent,
        TemplatesComponent,
        LoaderComponent
        // BmxCreatorComponent,
        // SafePipe,
        // OrderDasboardComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HammerModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatRippleModule,
        MatFormFieldModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatBadgeModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        // FlexLayoutModule,
        // DragDropModule,
        MatTooltipModule,
        MatGridListModule,
        MatSidenavModule,
        CKEditorModule,
        FormsModule,
        MatTableModule,
        // HotkeyModule.forRoot(),
        MatSliderModule,
        MatTabsModule,
        // QRCodeModule,
        // DeviceDetectorModule,
        //AngularDateTimePickerModule,
        MatDatepickerModule,
        MatSelectModule,
        MatRadioModule,
        MatNativeDateModule,
        MatProgressBarModule,
        NgxChartsModule,
        // AngularEditorModule,
        DragulaModule.forRoot(),
        MatListModule,
        // NgxEchartsModule.forRoot({ echarts: loadEcharts }),
        MatSnackBarModule,
        MatSortModule,
        MatPaginatorModule,
        DragDropModule,
        ScrollingModule,
        CdkTableModule,
        CdkTreeModule,
        A11yModule,
        MatAutocompleteModule,
        SignalComponent,
        QuillModule
        // BmxModule
    ],
    providers: [
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 1000 } }],
    bootstrap: [AppComponent]
})
export class AppModule { }

