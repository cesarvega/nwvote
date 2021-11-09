import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { HighlightSpanKind } from 'typescript';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';


@Component({
  selector: 'app-participants-email',
  templateUrl: './participants-email.component.html',
  styleUrls: ['./participants-email.component.scss']
})
export class ParticipantsEmailComponent implements OnInit {
  allData;

  attachments = [];
  dirConfirm = false;
  deptConfirm = false;
  viewedData;
  selected;
  @Input() isMenuActive15;
  displayedColumns: string[] = ['select', 'FirstName', 'LastName', 'group', 'SubGroup', 'Status'];
  RESPONDENTS_LIST;
  to;
  dataSource;
  selection;
  ckconfig: any;
  selectedIndex: any
  sampleHtml = `Dear PARTICIPANT,
  You have been selected to participate in the brand name selection for BI Pharma's new ADSSK & CCC Inhibitor for the treatment of multiple cancer types. 
  In this survey, you'll be voting on multiple name candidates that have been developed specifically for this compound. The survey will guide you, and an instructions button is available at any time for your assistance.
  We hope you enjoy this piece of your branding process. Please select Continue below to officially start your survey. 
  Best,
  The Brand Institute Team`
  selectedOption: any;
  emailTemp;
  linkType;
  From;
  BCC;
  CC;
  Subject;
  LINK_TYPE = [
    { name: 'Direct Link', rationale: 'Sist, Assist, Syst' },
    { name: 'General Link', rationale: 'Hance, En-' },
  ];

  /*EMAIL_TEMPLATES = [
    { name: 'Design', rationale: 'Sist, Assist, Syst' },
    { name: 'Creative', rationale: 'Hance, En-' },
    { name: 'Contest/Namepage', rationale: 'Evo' },
    { name: 'Nonproprietary Name', rationale: 'Gard, Guard' },
    { name: 'Nonproprietary Suffix', rationale: 'Gard, Guard' },
    { name: 'Logo', rationale: 'Gard, Guard' },
    { name: 'Pharmaceutical/Rx', rationale: 'Gard, Guard' }
  ];*/

  EMAIL_TEMPLATES = ['Creative', 'Design', 'Nonproprietary'];

  model = {
    editorData: '',
    namesData: ''
  };

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

  constructor(private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService) {

  }

  ngOnInit(): void {
    this.selected = 'All';
    
    

    this._BmxService.BrandMatrixGetParticipantList(localStorage.getItem('projectName'))
    .subscribe((arg:any) => {
      this.allData = JSON.parse(arg.d).ParticipantList;
      this.changeView();
    });
    this.emailTemp = 'Creative';
    this.changeTemplate('Creative');

   
    this.selection = new SelectionModel<any>(true, []);
    this.to = '';
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.to = '';
    }
    else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        if (!this.to.includes(row.FirstName)) {
          this.to += row.FirstName + '; ';

        }
      });

    }

  }

  selectRow($event, dataSource) {
    if ($event.checked) {
      this.to += dataSource.Email + '; ';
    }
    else {
      this.to = this.to.replace(dataSource.Email + '; ', "");
    }
  }

  changeView(): void {
    this.viewedData = [];
    for (let i = 0; i < this.allData.length; i++) {
      if (this.selected == 'NS' && this.allData[i].Status == 'NS') {

        this.viewedData.push(this.allData[i])
      }
      else if (this.selected == 'NF' && this.allData[i].Status == 'NF') {

        this.viewedData.push(this.allData[i])
      }
      else if (this.selected == 'F' && this.allData[i].Status == 'F') {
        this.viewedData.push(this.allData[i])
      }
      else if(this.selected == 'All') {
        this.viewedData = this.allData;
        break;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.viewedData);
  }

  changeTemplate(template: any): void 
  {
    if(template === 'Creative')
    {
      this.brandMatrixObjects[1].componentText = `Dear NAMEOFUSER,<br><br>

      Brand Institute has been contracted to create a brand name for (insert description of what is being named here).  The internal name for this project is PROJECTNAME.  You have been chosen to vote for your favorite names via our online BrandMatrix™ prioritization survey.<br><br>
      
      To access the online voting site, please click on the link below to be logged in automatically. Voting instructions are provided in the link and will only take a few minutes of your time.<br><br>
      
      Your link:<br>
      https://brandmatrix.brandinstitute.com/SURVEYNAME/index.asp/custom_link<br>
      (if you cannot click on the link, please copy and paste into your browser)<br><br>
      
      Your input is valued.  Please place your votes by (insert closing date and time). We hope you enjoy this interactive exercise!<br><br>  
      
      Best regards,<br><br>
      
      DIRECTOR NAME<br>
      Email<br>
      Number<br><br>
      
      Should you experience any difficulty with this survey, please contact us or your project team leader immediately.`

    }
    else if(template === 'Nonproprietary')
    {
      this.brandMatrixObjects[1].componentText = `Dear NAMEOFUSER,<br><br>

      Brand Institute has been contracted to create a nonproprietary (USAN/INN) name for (insert nonproprietary name or product description).  The internal name for this project is PROJECTNAME.  You have been chosen to vote for your favorite names via our online BrandMatrix™ prioritization survey.<br><br>
      
      To access the online voting site, please click on the link below to be logged in automatically. Voting instructions are provided in the link and will only take a few minutes of your time.<br><br>
      
      Your link:<br>
      https://brandmatrix.brandinstitute.com/SURVEYNAME/index.asp/custom_link<br>
      (if you cannot click on the link, please copy and paste into your browser)<br><br>
      
      Your input is valued.  Please place your votes by (insert closing date and time). We hope you enjoy this interactive exercise!<br><br>  
      
      Best regards,<br><br>
      
      DIRECTOR NAME<br>
      Email<br>
      Number<br><br>
      
      Should you experience any difficulty with this survey, please contact us or your project team leader immediately.
      `;

    }
    else
    {
      this.brandMatrixObjects[1].componentText = `Dear NAMEOFUSER,<br><br>

      Brand Institute has been contracted to create a visual identity for (insert description of what the logo is being developed for).  The internal name for this project is PROJECTNAME.  You have been chosen to vote for your favorite logo options via our online BrandMatrix™ prioritization survey.<br><br>
      
      To access the online voting site, please click on the link below to be logged in automatically. Voting instructions are provided in the link and will only take a few minutes of your time.<br><br>
      
      Your link:<br>
      https://brandmatrix.brandinstitute.com/SURVEYNAME/index.asp/custom_link<br>
      (if you cannot click on the link, please copy and paste into your browser)<br><br>
      
      Your input is valued.  Please place your votes by (insert closing date and time). We hope you enjoy this interactive exercise!<br><br>
      
      Best regards,<br><br>
      
      DIRECTOR NAME<br>
      Email<br>
      Number<br><br>
      
      Should you experience any difficulty with this survey, please contact us or your project team leader immediately.
      `;

    }
  }

  sendEmail()
  {
    const rememberEmail:JSON = <JSON><unknown>{
      "dirConfirm": this.dirConfirm,
      "deptConfirm": this.deptConfirm,
      "emailTemp" : this.emailTemp,
      "linkType" : this.linkType,
      "From" : 'cgomez@brandinstitute.com',
      /*"BCC" : this.BCC,
      "CC" : this.CC,*/
      "Subject" : this.Subject,
      "Message" : this.brandMatrixObjects[1].componentText,
      "TO" : 'kcabrera@brandinstitute.com',
      "attachments" : this.attachments
    }
    var finalString = JSON.stringify(rememberEmail);
    finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
    this._BmxService.sendEmail(finalString).subscribe(result => {
      var so = result;
    });
    localStorage.setItem('fakeprojectname' + '_emailInfo', JSON.stringify(rememberEmail));
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      var filearray = event.target.files;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          const filedata = event.target.result.split(",")[0];
          const resourceData:JSON = <JSON><unknown>{
            "ProjectName": localStorage.getItem('projectName'),
            "FileName": filearray[i].name,
            "ItemType" : 'TestName',
            "FileType" : filedata,
            "FileContent" : event.target.result.split(event.target.result.split(",")[0] + ',').pop()
          }
          this.attachments.push(resourceData);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    const t = this.attachments;
  }

  deleteFile(index)
  {
    this.attachments.splice(index, 1);
  }

}
