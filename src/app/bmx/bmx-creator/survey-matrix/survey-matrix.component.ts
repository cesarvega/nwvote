import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
// import { Nw3Service } from './nw3.service';
import { ActivatedRoute } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';
// import { Nw3Service } from '../../nw3/nw3.service';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BmxCreatorComponent } from '../bmx-creator.component';

@Component({
  selector: 'app-survey-matrix',
  templateUrl: './survey-matrix.component.html',
  styleUrls: ['./survey-matrix.component.scss']
})
export class SurveyMatrixComponent extends BmxCreatorComponent implements OnInit {
  @Input() isMenuActive11;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  username: any;
  constructor(@Inject(DOCUMENT)  document: any,
    activatedRoute: ActivatedRoute,
   _hotkeysService: HotkeysService,  dragulaService: DragulaService,  _BmxService: BmxService) {
   
    super(document,activatedRoute, _hotkeysService, dragulaService, _BmxService)

    activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      this.username = params['username'];
      localStorage.setItem('projectId',  this.projectId);
      // this.bsrService.getProjectData(this.projectId).subscribe(arg => {
      //   this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
      //   localStorage.setItem('projectName',  this.projectId);        
      // });
    });
  }

  ngOnInit(): void {
   


    this.toggleMenuActive('isMenuActive11')
    this.isMainMenuActive = false;
    this.bmxClientPageDesignMode = false;
    this.bmxClientPageOverview = false;
    this.displayRightSideMenu = false;
  }

}
