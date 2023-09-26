import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { BmxService } from './bmx.service';
import { DragulaService } from 'ng2-dragula';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-bmx-creator',
  templateUrl: './bmx-creator.component.html',
  styleUrls: ['./bmx-creator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BmxCreatorComponent implements OnInit {
  // https://getemoji.com/
  userName = 'Alexa';
  bmxClientPageDesignMode = false; // TURN FALSE TO PLAY ON DEVELOPMENT
  bmxClientPageOverview = false;
  displayRightSideMenu = false;
  isBrandMatrixSurvey = true;
  saveProjectSuccess = false;
  widthTemporary: string = ""
  CREATION_VIDEO_PATH="assets/videos/projectCreation.mp4" 
  showCreationModalVideo: boolean = false
  
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
    namesData: '',
  };

  ckconfig: any;
  selectedIndex: any;
  sampleHtml = `Dear PARTICIPANT,
  You have been selected to participate in the brand name selection for BI Pharma's new ADSSK & CCC Inhibitor for the treatment of multiple cancer types.
  In this survey, you'll be voting on multiple name candidates that have been developed specifically for this compound. The survey will guide you, and an instructions button is available at any time for your assistance.
  We hope you enjoy this piece of your branding process. Please select Continue below to officially start your survey.
  Best,
  The Brand Institute Team`;
  selectedOption: any;

  // SURVEY CREATOR VARIABLES & SCHEME
  brandMatrixObjects = [
    {
      componentType: 'logo-header',
      componentText: this.sampleHtml,
      componentSettings: [
        { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
      ],
    },
    {
      componentType: 'text-editor',
      componentText: this.sampleHtml,
      componentSettings: [
        { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
      ],
    },
    {
      componentType: 'ranking-scale',
      componentText: this.sampleHtml,
      componentSettings: [
        { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
      ],
    },
    {
      componentType: 'text-editor',
      componentText: this.sampleHtml,
      componentSettings: [
        { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
      ],
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
    DirectorList: '',
  };

  testProject: any;
  globalProjectName: any;
  userGUI: any;
  userFullName: any;
  userOffice: any;
  userRole: any;
  Role: any;
  userDepartment: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    dragulaService: DragulaService,
    private _BmxService: BmxService,
    private msalService: MsalService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.userGUI = params['id'];

      // localStorage.setItem('projectId', this.projectId);
      this._BmxService.getMatrixUser(this.userGUI).subscribe((data: any) => {
        data = JSON.parse(data.d);        
        this.userName = data.UserName;
        this.userFullName = data.FullName;
        this.userOffice = data.Office;
        this.userRole = (data.Role == 'Adminstrator')?'Administrator':data.Role;
        this.userDepartment = data.Role;

        // TEST DATA
        // this.userOffice = 'Miami';
        // this.userRole = 'admin'; // no restrictions
        // this.userDepartment = 'Creative';
        // this.userOffice = 'Basel 1'
        // this.userRole = 'director'; // director restriced
        // this.userRole = 'creative';
        // this.userRole = 'user'
        // this.userDepartment = 'Design'
      });
    });

    this._BmxService.currentProjectName$.subscribe((res) => {
      this.globalProjectName = res ? res : '';
    });

    // PRODUCTION INITIAL MENU
    this.toggleMenuActive('isMenuActive1');
    this.bmxClientPageDesignMode = true;
    this.isMainMenuActive = true;

    // TESTING SETTINGS 🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎
    // this.toggleMenuActive('isMenuActive16');
    // this.bmxClientPageDesignMode = false;
    // this.isMainMenuActive = false;
    // END TESTING SETTINGS 🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎

    this._BmxService.getGeneralLists().subscribe((arg: any) => {
      this.settingsData = JSON.parse(arg.d);
    });

    // DRAGGING SERVICE FOR SURVEY CREATOR
    dragulaService.createGroup('TASKS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('emoji-handle');
      },
    });
    // document.body.style.zoom = 1.10;
  }

  ngOnInit(): void {
    //localStorage.removeItem('projectName');

    this._BmxService.getLogoTemporaryWidth$().subscribe((data: any) =>{
      this.widthTemporary = data
    })
    this.ckconfig = {
      allowedContent: false,
      width: '99.6%',
      contentsCss: ['body {font-size: 24px;}'],
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
        {
          name: 'paragraph',
          groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
        },
        { name: 'styles' },
        { name: 'links' },
        { name: 'about' },
      ],
      addPlugins: 'simplebox,tabletools',
      removePlugins: 'horizontalrule,specialchar,about,others',
      removeButtons:
        'Smiley,tableselection,Image,Superscript,Subscript,Save,NewPage,Preview,Print,Templates,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Find,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,Flash,PageBreak,Iframe,ShowBlocks,Cut,Copy,Paste,Table,Format,Source,Maximize,Styles,Anchor,SpecialChar,PasteFromWord,PasteText,Scayt,RemoveFormat,Indent,Outdent,Blockquote',
    };
    // SAMPLE DATA FOR CKEDITOR
    this.model.editorData = this.sampleHtml;

  }
  signOut() {
    this.msalService.logout();
    window.location.href = '/login'
  }
  // menu functionallity toggles the active link scss
  toggleMenuActive(menuItem) {
    this._BmxService.currentprojectData$.subscribe((data: any) => {
      if (data.length > 0) {
        this.projectName = data[0].ProjectName;
        this.projectId = data[0].PresentationId;
        // localStorage.setItem('projectName', this.projectName);
        // localStorage.setItem('data', this.projectId);
      }
    });

    if (menuItem === 'isMenuActive1') {
      this.isMainMenuActive = true;
      localStorage.removeItem('projectName');
    } else if (menuItem === 'isMenuActive11') {
      this.bmxClientPageDesignMode = false;
      this.bmxClientPageOverview = true;
      this.isMainMenuActive = false;
    }
    this.isMenuActive1 = menuItem === 'isMenuActive1' ? true : false;
    this.isMenuActive2 = menuItem === 'isMenuActive2' ? true : false;
    this.isMenuActive3 = menuItem === 'isMenuActive3' ? true : false;
    this.isMenuActive4 = menuItem === 'isMenuActive4' ? true : false;
    this.isMenuActive5 = menuItem === 'isMenuActive5' ? true : false;
    this.isMenuActive6 = menuItem === 'isMenuActive6' ? true : false;
    this.isMenuActive7 = menuItem === 'isMenuActive7' ? true : false;
    this.isMenuActive8 = menuItem === 'isMenuActive8' ? true : false;
    this.isMenuActive9 = menuItem === 'isMenuActive9' ? true : false;
    this.isMenuActive10 = menuItem === 'isMenuActive10' ? true : false;
    this.isMenuActive11 = menuItem === 'isMenuActive11' ? true : false;
    this.isMenuActive12 = menuItem === 'isMenuActive12' ? true : false;
    this.isMenuActive13 = menuItem === 'isMenuActive13' ? true : false;
    this.isMenuActive14 = menuItem === 'isMenuActive14' ? true : false;
    this.isMenuActive15 = menuItem === 'isMenuActive15' ? true : false;
    this.isMenuActive16 = menuItem === 'isMenuActive16' ? true : false;
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

  editBM(event) {
    this.isMenuActive1 = event;
    this.isMainMenuActive = event;
    this.isMenuActive8 = !event;
  }

  emailBM(event) {
    this.isMenuActive1 = event;
    this.isMainMenuActive = event;
    this.isMenuActive15 = !event;
  }
  saveProject(event: boolean){
    this.saveProjectSuccess = event;
  }
}
