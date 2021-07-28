import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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

@Component({
  selector: 'app-bmx-creator',
  templateUrl: './bmx-creator.component.html',
  styleUrls: ['./bmx-creator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BmxCreatorComponent implements OnInit {
  // https://getemoji.com/
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
  
  isTemplateSelected = '';
  isSelectedButton = '';

  isMainMenuActive = true;

  model = {
    editorData: '',
    namesData: ''
  };

  ckconfig: any;
  selectedIndex: any
  sampleHtml = `<p style="text-align:center;color:red">Instructions</p>\n\n<p style=\"text-align:justify\"><br />\nPlease select at least three &quot;themes&quot; you would consider to move forward for the Line Draw Family.</p>\n\n<p style=\"text-align:justify\"><strong>What do we mean by &quot;theme&quot;:</strong></p>\n\n<p style=\"text-align:justify\">We will develop names that pertain to an overarching theme. Each individual name candidate will have potential to be used as an ingredient brand to be used across all Line Draw Family concepts or as it pertains to each individual concept. In the latter scenario, we will develop names with a common word part and this word part will be included in each concept name. For example, if you choose the &quot;Optimized&quot; theme, we will develop candidates around the Op/Opt/Opti word parts.</p>\n\n<p style=\"text-align:justify\"><strong>How many themes should I vote on?</strong></p>\n\n<p style=\"text-align:justify\">You can select as many as you&rsquo;d like but we request that you select at least 3 themes. Based on the vote, we will select three to five themes for full creative exploration. How do I provide a vote? To make a selection, simply click the checkbox to the left of the desired name candidate. After you make a selection, you will be asked to rate that theme based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.</p>\n\n<p style=\"text-align:justify\">Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n`
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
    { name: 'NArrowDown', rationale: 'Evo' },
    { name: 'This or That', rationale: 'Gard, Guard' },
    { name: 'Naming Contest', rationale: 'In, Inv' },
    { name: 'Question & Answer', rationale: 'Omni' },
    { name: 'Build Your Own', rationale: 'Opti, Opt, Op' },
    { name: 'SHIELD', rationale: 'Shield' },
    { name: 'SYNCHRONIZE', rationale: 'Synch, Sync' },
    { name: 'TRUSTED', rationale: 'Trus, Tru' },
    { name: 'NOMANER', rationale: 'referred' },
    { name: 'ASSIST', rationale: 'Sist, Assist, Syst' },
    { name: 'ENHANCE', rationale: 'Hance, En-' },
    { name: 'EVOLVE', rationale: 'Evo' },
    { name: 'GUARD', rationale: 'Gard, Guard' },
  ];

  testNames = [
    { name: 'ASSIST', rationale: 'Sist, Assist, Syst' },
    { name: 'ENHANCE', rationale: 'Hance, En-' },
    { name: 'EVOLVE', rationale: 'Evo' },
    { name: 'GUARD', rationale: 'Gard, Guard' },
    { name: 'INVEST', rationale: 'In, Inv' },
    { name: 'OMNI', rationale: 'Omni' },
    { name: 'OPTIMAL', rationale: 'Opti, Opt, Op' },
    { name: 'SHIELD', rationale: 'Shield' },
    { name: 'SYNCHRONIZE', rationale: 'Synch, Sync' },
    { name: 'TRUSTED', rationale: 'Trus, Tru' },
    { name: 'NOMANER', rationale: 'referred' },
  ];

  settingsData = { 
    SalesBoardProjectList : '',
    DepartmentList : '',
    OfficeList : '',
    LanguageList : '',
    DirectorList : ''
  };

  constructor(@Inject(DOCUMENT) private document: any,
    private _NW3Service: Nw3Service, private activatedRoute: ActivatedRoute,
    private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService) {
    // this.activatedRoute.params.subscribe(params => {
    //   this.projectName = params['id'];
    //   localStorage.setItem('projectName', this.projectName);
    //   this._NW3Service.getProjectId(this.projectName).subscribe((data: any) => {
    //     this.projectId = data[0].PresentationId;
    //     localStorage.setItem('data', data[0].PresentationId);
    //   })
    // });

    this.toggleMenuActive('isMenuActive9')
    this.isMainMenuActive = false;

    this._BmxService.getGeneralLists()
    .subscribe((arg:any) => {
      this.settingsData = JSON.parse(arg.d);
      console.log(JSON.parse(arg.d));      
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
    
  }

  createNewBmxComponent() {
    window.scrollTo(300, 500);
    this.brandMatrixObjects.push({
      componentType: 'text-editor',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    })
  }

  checkDragEvetn(e) {
    console.log(e);
  }

}