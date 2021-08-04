import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmxCreatorComponent } from '../bmx-creator/bmx-creator.component';
import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { LoginComponent } from './auth/login/login.component';
// import { NwVoteComponent } from './nw-vote/nw-vote.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
// import { NwvoteService } from './nw-vote/nwvote.service';
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
// import { BsrMobileComponent, editName } from './bsr-mobile/bsr-mobile.component';
// import { BsrMobileService } from './bsr-mobile/bsr-mobile.service';
// import { BsrComponent, editPost } from './bsr/bsr.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatDatepickerModule } from '@angular/material';
import { HotkeyModule } from 'angular2-hotkeys';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { QRCodeModule } from 'angularx-qrcode';
import { DeviceDetectorModule } from 'ngx-device-detector';
// import { NW3Component } from './nw3/nw3.component';
// import { Nw3Service } from './nw3/nw3.service';
// import { BmxComponent } from './bmx/bmx.component';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
// import { SchedulerComponent } from './scheduler/scheduler.component';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DragulaModule } from 'ng2-dragula';
import { MatListModule } from '@angular/material/list';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
// import { BmxCreatorComponent } from './bmx-creator/bmx-creator.component';
import { SafePipe } from './safe.pipe';
import { BmxRoutingModule } from './bmx-routing.module';
import { BmxComponent } from '../bmx-survey/bmx.component';
import { ProjectListComponent } from '../bmx-creator/project-list/project-list.component';
import { RespondentsComponent } from '../bmx-creator/respondents/respondents.component';
import { SurveyCreationDesignComponent } from '../bmx-creator/survey-creation-design/survey-creation-design.component';
import { ImageUploaderComponent } from '../bmx-creator/image-uploader/image-uploader.component';
// import { RespondentsComponent } from '../bmx-creator/respodents/RespondentsComponent';
// import { BmxModule } from './bmx/bmx/bmx.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
export function loadEcharts() {
  return import('echarts');
}


@NgModule({
  declarations: [BmxComponent,
    BmxCreatorComponent,
    SafePipe,
    ProjectListComponent,
    RespondentsComponent,    
    SurveyCreationDesignComponent,
    ImageUploaderComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
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
    FlexLayoutModule,
    DragDropModule,
    MatTooltipModule,
    MatGridListModule,
    MatSidenavModule,
    CKEditorModule,
    FormsModule,
    MatTableModule,
    HotkeyModule.forRoot(),
    MatSliderModule,
    MatTabsModule,
    QRCodeModule,
    DeviceDetectorModule,
    AngularDateTimePickerModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressBarModule,
    NgxChartsModule,
    DragulaModule.forRoot(),
    MatListModule,
    NgxEchartsModule.forRoot({echarts: loadEcharts}),
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    BmxRoutingModule,
    MatAutocompleteModule
  ]
})
export class BmxModule { }
