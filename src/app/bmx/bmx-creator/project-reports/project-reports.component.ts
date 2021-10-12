import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { DragulaService } from 'ng2-dragula';
import { BmxService } from '../bmx.service';

import { SurveyCreationDesignComponent } from '../survey-creation-design/survey-creation-design.component';

@Component({
  selector: 'app-project-reports',
  templateUrl: './project-reports.component.html',
  styleUrls: ['./project-reports.component.scss'],
})
export class ProjectReportsComponent
  extends SurveyCreationDesignComponent
  implements OnInit
{
  @Input() isMenuActive11;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;


  bmxPagesClient;
  @Input() isMobile;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  username: any;

  projectId;
  popUpQRCode = false;
  elem: any;
  isFullscreen: any;
  constructor(
    @Inject(DOCUMENT) document: any,
    activatedRoute: ActivatedRoute,
    _hotkeysService: HotkeysService,
    dragulaService: DragulaService,
    public _snackBar: MatSnackBar,
    _BmxService: BmxService
  ) {
    super(document, _BmxService, _snackBar,activatedRoute);
  }

  ngOnInit(): void {}
}
