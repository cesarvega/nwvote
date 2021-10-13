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
import { Nw3Service } from '../../nw3/nw3.service';
import { BmxService } from './bmx.service';
import { DragulaService } from 'ng2-dragula';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-bmx-creator',
  templateUrl: './bmx-creator.component.html',
  styleUrls: ['./bmx-creator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BmxCreatorComponent implements OnInit {
  // https://getemoji.com/
  bmxClientPageDesignMode = true;
  bmxClientPageOverview = true;
  displayRightSideMenu = true;
  isMobile = true


  projectName: any;
  projectId: any;
  soundVolume = 0.2;
  isMenuActive1;
  isMenuActive2;
  isMenuActive3;
  isMenuActive4;
  isMenuActive5;
  isMenuActive6;
  isMenuActive7;
  isMenuActive8;
  isMenuActive9;
  isMenuActive10;
  isMenuActive11;
  isMenuActive12;
  isMenuActive13;
  isMenuActive14;
  isMenuActive15;
  isMenuActive16;

  // TEMPLATE SELECTOR VARABLES
  isTemplateSelected = '';
  isSelectedButton = '';

  isMainMenuActive = true;
  

  model = {
    editorData: '',
    namesData: ''
  };

  ckconfig: any;
  selectedIndex: any
  sampleHtml = `Dear PARTICIPANT,
  You have been selected to participate in the brand name selection for BI Pharma's new ADSSK & CCC Inhibitor for the treatment of multiple cancer types. 
  In this survey, you'll be voting on multiple name candidates that have been developed specifically for this compound. The survey will guide you, and an instructions button is available at any time for your assistance.
  We hope you enjoy this piece of your branding process. Please select Continue below to officially start your survey. 
  Best,
  The Brand Institute Team`
  selectedOption: any;

  // SURVEY CREATOR VARIABLES & SCHEME
  brandMatrixObjects = [
    {
      componentType: 'logo-header',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
    {
      componentType: 'text-editor',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
    {
      componentType: 'ranking-scale',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
    {
      componentType: 'text-editor',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],


    },
  ];


  TEMPLATES = [
    { name: 'Standart Personal Preference', rationale: 'Sist, Assist, Syst' },
    { name: 'Ranking', rationale: 'Hance, En-' },
    { name: 'NarrowDown', rationale: 'Evo' },
    { name: 'This or That', rationale: 'Gard, Guard' },
    { name: 'Naming Contest', rationale: 'In, Inv' },
    { name: 'Question & Answer', rationale: 'Omni' },
    { name: 'Build Your Own', rationale: 'Opti, Opt, Op' },
  ];


  settingsData = {
    SalesBoardProjectList: [],
    DepartmentList: '',
    OfficeList: '',
    LanguageList: '',
    DirectorList: ''
  };

  testProject: any;


  constructor(@Inject(DOCUMENT) private document: any,
     private activatedRoute: ActivatedRoute,
    private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService) {
    // this.activatedRoute.params.subscribe(params => {
    //   this.projectName = params['id'];
    //   localStorage.setItem('projectName', this.projectName);
    //   this._NW3Service.getProjectId(this.projectName).subscribe((data: any) => {
    //     this.projectId = data[0].PresentationId;
    //     localStorage.setItem('data', data[0].PresentationId);
    //   })
    // });

    this.toggleMenuActive('isMenuActive11')
    this.isMainMenuActive = false;


    this._BmxService.getGeneralLists()
      .subscribe((arg: any) => {
        this.settingsData = JSON.parse(arg.d);
      });



    // DRAGGING SERVICE FOR SURVEY CREATOR
    dragulaService.createGroup('TASKS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('emoji-handle');
      }
      
    })
    // document.body.style.zoom = 1.10;

  }

  ngOnInit(): void {
    //localStorage.removeItem('projectName');
    this.ckconfig = {
      allowedContent: false,
      width: '99.6%',
      contentsCss: ["body {font-size: 24px;}"],
      height: 280,
      forcePasteAsPlainText: true,
      toolbarLocation: 'top',
      toolbarGroups: [
        { name: 'clipboard', groups: ['clipboard', ''] },
        { name: 'insert' },
        { name: 'forms' },
        { name: 'tools' },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'others' },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'colors' },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
        { name: 'styles' },
        { name: 'links' },
        { name: 'about' }
      ],
      addPlugins: 'simplebox,tabletools',
      removePlugins: 'horizontalrule,specialchar,about,others',
      removeButtons: 'Smiley,tableselection,Image,Superscript,Subscript,Save,NewPage,Preview,Print,Templates,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Find,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,Flash,PageBreak,Iframe,ShowBlocks,Cut,Copy,Paste,Table,Format,Source,Maximize,Styles,Anchor,SpecialChar,PasteFromWord,PasteText,Scayt,RemoveFormat,Indent,Outdent,Blockquote'

    }
    // SAMPLE DATA FOR CKEDITOR
    this.model.editorData = this.sampleHtml;
  }



  // menu functionallity toggles the active link scss
  toggleMenuActive(menuItem) {
    if(menuItem === 'isMenuActive1')
    { this.isMainMenuActive = true;
      localStorage.removeItem('projectName');
    } else if(menuItem === 'isMenuActive11'){
      this.bmxClientPageDesignMode = false;
      this.bmxClientPageOverview = true;
      this.isMainMenuActive = false;
     }
    this.isMenuActive1 = (menuItem === 'isMenuActive1') ? true : false;
    this.isMenuActive2 = (menuItem === 'isMenuActive2') ? true : false;
    this.isMenuActive3 = (menuItem === 'isMenuActive3') ? true : false;
    this.isMenuActive4 = (menuItem === 'isMenuActive4') ? true : false;
    this.isMenuActive5 = (menuItem === 'isMenuActive5') ? true : false;
    this.isMenuActive6 = (menuItem === 'isMenuActive6') ? true : false;
    this.isMenuActive7 = (menuItem === 'isMenuActive7') ? true : false;
    this.isMenuActive8 = (menuItem === 'isMenuActive8') ? true : false;
    this.isMenuActive9 = (menuItem === 'isMenuActive9') ? true : false;
    this.isMenuActive10 = (menuItem === 'isMenuActive10') ? true : false;
    this.isMenuActive11 = (menuItem === 'isMenuActive11') ? true : false;
    this.isMenuActive12 = (menuItem === 'isMenuActive12') ? true : false;
    this.isMenuActive13 = (menuItem === 'isMenuActive13') ? true : false;
    this.isMenuActive14 = (menuItem === 'isMenuActive14') ? true : false;
    this.isMenuActive15 = (menuItem === 'isMenuActive15') ? true : false;
    this.isMenuActive16 = (menuItem === 'isMenuActive16') ? true : false;
  }

  checkDragEvetn(e) {
    console.log(e);
  }
  
  
  toggleViewPageModeDesign() {
    this.bmxClientPageDesignMode = !this.bmxClientPageDesignMode;
  }
  
  toggleViewPageMode() {
    this.bmxClientPageOverview = !this.bmxClientPageOverview;
  }

  editBM(event)
  {
    console.log(event)
    this.isMenuActive1 = event;
    this.isMainMenuActive = event;
    this.isMenuActive8 = !event;
  }

  emailBM(event)
  {
    console.log(event)
    this.isMenuActive1 = event;
    this.isMainMenuActive = event;
    this.isMenuActive15 = !event;
  }

}