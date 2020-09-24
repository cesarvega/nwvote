import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { HotkeyModule } from 'angular2-hotkeys';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NwVoteComponent,
    BsrMobileComponent,
    editName,
    editPost,
    BsrComponent,
  ],
  imports: [
    BrowserModule,
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
    HotkeyModule.forRoot(),
    MatSliderModule,
    // AngularEditorModule,
    
  ],
  entryComponents: [
    editPost,
  ],
  providers: [NwvoteService, BsrMobileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
