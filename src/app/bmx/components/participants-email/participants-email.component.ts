import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { HighlightSpanKind } from 'typescript';
import { DragulaService } from 'ng2-dragula';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MatSort } from '@angular/material/sort';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { BmxService } from '../bmx-creator/bmx.service';


@Component({
  selector: 'app-participants-email',
  templateUrl: './participants-email.component.html',
  styleUrls: ['./participants-email.component.scss']
})
export class ParticipantsEmailComponent implements OnInit {
  allData;
  DIRECTORS;
  attachments = [];
  dirConfirm = false;
  deptConfirm = false;
  viewedData;
  selected;
  @Input() isMenuActive15;
  displayedColumns: string[] = ['select', 'FirstName', 'LastName', 'Type', 'SubGroup', 'Status'];
  RESPONDENTS_LIST = [];
  @ViewChild(MatSort) sort: MatSort;
  to;
  dataSource;
  selection;
  ckconfig: any;
  selectedIndex: any;
  projectId;
  fixedString;
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
    'Direct Link', 'General Link'
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

  constructor(private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService, private _snackBar: MatSnackBar, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.selected = 'All';

    this._BmxService.currentProjectName$.subscribe(projectName => {
      this.projectId = (projectName !== '') ? projectName : this.projectId;
      this.Subject = this.projectId?.toString().trim() + ' Naming Initiative';
    })

    this._BmxService.getProjectInfo(this.projectId)
      .subscribe((arg: any) => {
        if (arg.d && arg.d.length > 0) {
          var data = JSON.parse(arg.d)
          this.DIRECTORS = data.bmxRegionalOffice;
          this.From = this.DIRECTORS[0].email.trim();
        }
      });

    this._BmxService.BrandMatrixGetParticipantList(this.projectId)
      .subscribe((arg: any) => {
        this.allData = JSON.parse(arg.d).ParticipantList;
        for (let p of this.allData) {
          if (Number(p.Status) < 0) {
            p.Status = 'NS'
          }
          else if (Number(p.Status) === 999) {
            p.Status = 'F'
          }
        }
        this.changeView();
      });



    this._BmxService.getCustomEmail(this.projectId)
      .subscribe((arg: any) => {
        this.sampleHtml = arg.d;
        //var data = JSON.parse(arg.d);
        if (arg.d === '') {
          this.emailTemp = 'Creative';
          this.changeTemplate('Creative');
        }
        else {
          this.brandMatrixObjects[1].componentText = arg.d;
        }
        //this.DIRECTORS = data.bmxRegionalOffice;
      });



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
    //this.model.editorData = this.sampleHtml;

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.RESPONDENTS_LIST = [];
      this.to = '';
    }
    else {
      this.dataSource.data.forEach(row => {

        this.selection.select(row);
        if (!this.to.includes(row.Email)) {
          this.to += row.Email + '; ';
          this.RESPONDENTS_LIST.push(row);
        }
      });

    }

  }

  selectRow($event, dataSource) {
    if ($event.checked) {
      this.to += dataSource.Email + '; ';
      this.RESPONDENTS_LIST.push(dataSource);
    }
    else {
      this.to = this.to.replace(dataSource.Email + '; ', "");
      for (var i = 0; i < this.RESPONDENTS_LIST.length; i++) {
        if (this.RESPONDENTS_LIST[i] == dataSource) {
          this.RESPONDENTS_LIST.splice(i, 1);
          break;
        }
      }
    }
  }

  changeView(): void {
    this.viewedData = [];
    for (let i = 0; i < this.allData.length; i++) {
      if (this.selected == 'NS' && this.allData[i].Status == 'NS') {
        this.viewedData.push(this.allData[i])
      }
      else if (this.selected == 'NF' && Number(this.allData[i].Status) >= 0) {

        this.viewedData.push(this.allData[i])
      }
      else if (this.selected == 'F' && this.allData[i].Status == 'F') {
        this.viewedData.push(this.allData[i])
      }
      else if (this.selected == 'All') {
        this.viewedData = this.allData;
        break;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.viewedData);
    this.dataSource.sort = this.sort;
  }

  changeTemplate(template: any): void {
    if (template === 'Creative') {
      this.brandMatrixObjects[1].componentText = `Dear BI_PARTNAME,<br><br>

      Brand Institute has been contracted to create a brand name for (insert description of what is being named here).  The internal name for this project is PROJECTNAME.  You have been chosen to vote for your favorite names via our online BrandMatrix™ prioritization survey.<br><br>
      
      To access the online voting site, please click on the link below to be logged in automatically. Voting instructions are provided in the link and will only take a few minutes of your time.<br><br>
      
      Your link:<br>
      <a href="BI_LINK">BI_LINK</a><br>
      (if you cannot click on the link, please copy and paste into your browser)<br><br>
      
      Your input is valued.  Please place your votes by (insert closing date and time). We hope you enjoy this interactive exercise!<br><br>  
      
      Best regards,<br><br>
      
      BI_DIRECTOR 
      
      Should you experience any difficulty with this survey, please contact us or your project team leader immediately.`
      this.BCC = 'creative@brandinstitute.com'
    }
    else if (template === 'Nonproprietary') {
      this.brandMatrixObjects[1].componentText = `Dear BI_PARTNAME,<br><br>

      Brand Institute has been contracted to create a nonproprietary (USAN/INN) name for (insert nonproprietary name or product description).  The internal name for this project is PROJECTNAME.  You have been chosen to vote for your favorite names via our online BrandMatrix™ prioritization survey.<br><br>
      
      To access the online voting site, please click on the link below to be logged in automatically. Voting instructions are provided in the link and will only take a few minutes of your time.<br><br>
      
      Your link:<br>
      <a href="BI_LINK">BI_LINK</a><br>
      (if you cannot click on the link, please copy and paste into your browser)<br><br>
      
      Your input is valued.  Please place your votes by (insert closing date and time). We hope you enjoy this interactive exercise!<br><br>  
      
      Best regards,<br><br>
      
      BI_DIRECTOR 
      
      Should you experience any difficulty with this survey, please contact us or your project team leader immediately.
      `;
      this.BCC = 'chicago-nonproprietary@brandinstitute.com';
    }
    else {
      this.brandMatrixObjects[1].componentText = `Dear BI_PARTNAME,<br><br>

      Brand Institute has been contracted to create a visual identity for (insert description of what the logo is being developed for).  The internal name for this project is PROJECTNAME.  You have been chosen to vote for your favorite logo options via our online BrandMatrix™ prioritization survey.<br><br>
      
      To access the online voting site, please click on the link below to be logged in automatically. Voting instructions are provided in the link and will only take a few minutes of your time.<br><br>
      
      Your link:<br>
      <a href="BI_LINK">BI_LINK</a><br>
      (if you cannot click on the link, please copy and paste into your browser)<br><br>

      Your input is valued.  Please place your votes by (insert closing date and time). We hope you enjoy this interactive exercise!<br><br>
      
      Best regards,<br><br>
      
      BI_DIRECTOR 
      
      Should you experience any difficulty with this survey, please contact us or your project team leader immediately.
      `;
      this.BCC = 'design@brandinstitute.com'
    }
  }

  /*
  changeLink(template: any): void {
    if (template === 'Direct Link') {
      this.brandMatrixObjects[1].componentText = this.brandMatrixObjects[1].componentText.replace("projectName", "projectName/Username");
    }
    else if (template === 'General Link') {
      this.brandMatrixObjects[1].componentText = this.brandMatrixObjects[1].componentText.replace("projectName/Username", "projectName");
    }
  }*/

  replaceEmailInfo(Fname: string, Lname: string, id: string) {
    this.fixedString = this.fixedString.replace("BI_LINK", "https://brandmatrix.brandinstitute.com/BMX/" + id);
    this.fixedString = this.fixedString.replace("BI_LINK", "https://brandmatrix.brandinstitute.com/BMX/" + id);
    if (this.linkType === 'Direct Link') {
      this.brandMatrixObjects[1].componentText = this.brandMatrixObjects[1].componentText.replace("PROJECTNAME", "PROJECTNAME/Username");
    }
    else if (this.linkType === 'General Link') {
      this.brandMatrixObjects[1].componentText = this.brandMatrixObjects[1].componentText.replace("PROJECTNAME/Username", "PROJECTNAME");
    }
    this.fixedString = this.fixedString.replace("BI_PARTNAME", Fname + " " + Lname);
    this.fixedString = this.fixedString.replaceAll("PROJECTNAME", this.projectId.toString());
    let str = ""

      str += this.DIRECTORS[0].name.toString().trim() + "<br>" + this.DIRECTORS[0].title.toString().trim() + "<br>" + this.DIRECTORS[0].phone.toString().trim() + " " + this.DIRECTORS[0].email.toString().trim() + "<br><br>"

    this.fixedString = this.fixedString.replace("BI_DIRECTOR ", str);
  }

  sendEmail() {
    this._snackBar.open('Sending emails!');
    const emailTemplate: JSON = <JSON><unknown>{
      "ProjectName": this.projectId,
      "EmailTemplate": this.brandMatrixObjects[1].componentText
    }
    this._BmxService.setCustomEmail(JSON.stringify(emailTemplate))
      .subscribe(result => {
        var so = result;
      });




    for (var i = 0; i < this.RESPONDENTS_LIST.length; i++) {
      this.fixedString = this.brandMatrixObjects[1].componentText;
      this.replaceEmailInfo(this.RESPONDENTS_LIST[i].FirstName, this.RESPONDENTS_LIST[i].LastName, this.RESPONDENTS_LIST[i].NewId);
      const rememberEmail: JSON = <JSON><unknown>{
        "dirConfirm": this.dirConfirm,
        "deptConfirm": this.deptConfirm,
        "emailTemp": this.emailTemp,
        "linkType": this.linkType,
        "From": this.From,
        "BCC": this.BCC,
        /*"CC" : this.CC,*/
        "Subject": this.Subject,
        "Message": this.fixedString,
        "TO": this.RESPONDENTS_LIST[i].Email,
        "attachments": this.attachments
      }
      var finalString = JSON.stringify(rememberEmail);
      finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
      this._BmxService.sendEmail(finalString).subscribe(result => {
        var so = result;
      });
    }
    this._snackBar.open('All emails sent!');
    this.sendConfirm();
    //localStorage.setItem('fakeprojectName' + '_emailInfo', JSON.stringify(rememberEmail));
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      var filearray = event.target.files;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          const filedata = event.target.result.split(",")[0];
          const resourceData: JSON = <JSON><unknown>{
            "projectName": this.projectId,
            "FileName": filearray[i].name,
            "ItemType": 'TestName',
            "FileType": filedata,
            "FileContent": event.target.result.split(event.target.result.split(",")[0] + ',').pop()
          }
          this.attachments.push(resourceData);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    const t = this.attachments;
  }

  deleteFile(index) {
    this.attachments.splice(index, 1);
  }

  previewEmail() {
    let temp = this.brandMatrixObjects[1].componentText;
    this.fixedString = this.brandMatrixObjects[1].componentText;
    this.fixedString = this.Subject + "<br><br>" + this.fixedString;
    this.replaceEmailInfo('tester', 'tester', '***************');
    let email = this.fixedString;
    this.dialog.open(DialogComponent, { data: { email: email } });
  }

  getTitle(option: string) {
    if (option == "NS") {
      return "Not Started";
    }
    else if (option == "F") {
      return "Finished";
    }
    else {
      return "On page " + option;
    }
    return option;
  }

  sendConfirm() {
    let confirmEmail = "<u>Sent Emails</u><br>";

    for (var i = 0; i < this.RESPONDENTS_LIST.length; i++) {
      confirmEmail = confirmEmail + this.RESPONDENTS_LIST[i].FirstName + " " + this.RESPONDENTS_LIST[i].LastName + " " + this.RESPONDENTS_LIST[i].Email + "<br>"
    }

    confirmEmail = confirmEmail + "----------------------------------------------------------------------------" + "<br><br>";



    let temp = this.brandMatrixObjects[1].componentText;
    this.fixedString = this.brandMatrixObjects[1].componentText;
    this.fixedString = this.Subject + "<br><br>" + this.fixedString;
    this.replaceEmailInfo('tester', 'tester', '***************');
    let email = this.fixedString;
    for (let d of this.DIRECTORS) {
      email += d.name.toString().trim() + "<br>" + d.title.toString().trim() + "<br>" + d.phone.toString().trim() + " " + d.email.toString().trim() + "<br><br>"
      return
    }
    this.fixedString = this.fixedString.replace("BI_DIRECTOR ", email);
    this.fixedString = temp;

    confirmEmail = confirmEmail + email;

    const rememberEmail: JSON = <JSON><unknown>{
      "dirConfirm": this.dirConfirm,
      "deptConfirm": this.deptConfirm,
      "emailTemp": this.emailTemp,
      "linkType": this.linkType,
      "From": this.From,
      "BCC": "",
      /*"CC" : this.CC,*/
      "Subject": this.Subject,
      "Message": confirmEmail,
      "TO": this.BCC,
      "attachments": this.attachments
    }
    var finalString = JSON.stringify(rememberEmail);
    finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
    this._BmxService.sendEmail(finalString).subscribe(result => {
      var so = result;
    });
  }


}
