import { Component,AfterViewInit, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BmxService } from '../../../bmx.service';
import { ShowVideoComponent } from '../show-video/show-video.component';

@Component({
  selector: 'app-text-paragraph',
  templateUrl: './text-paragraph.component.html',
  styleUrls: ['./text-paragraph.component.scss']
})
export class TextParagraphComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;

  openSettings = false
  ckconfig;
  projectName: any;
  previousText = '';

  VIDEO_PATH: any[] = [];

  PATH1: any[] = [
    '/assets/img/bmx/imagen1.JPG',
    '/assets/img/bmx/imagen2.JPG',
    '/assets/img/bmx/imagen3.JPG',
  ]

  PATH2: any[] = [
    '/assets/img/bmx/imagen1.JPG',
    '/assets/img/bmx/imagen2.JPG',
    '/assets/img/bmx/imagen3.JPG',
  ]
  
  showModalVideo: boolean = true;

  @ViewChild('modalChecked') modalChecked: ElementRef | any;

  constructor(private _bmxService: BmxService) { }

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
      removeButtons: 'Smiley,tableselection,Image,Save,NewPage,Preview,Print,Templates,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Find,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,Flash,PageBreak,Iframe,ShowBlocks,Cut,Copy,Paste,Table,Format,Source,Maximize,Styles,Anchor,SpecialChar,PasteFromWord,PasteText,Scayt,RemoveFormat,Indent,Outdent,Blockquote'

    }

    this.previousText = this.bmxItem.componentText

    if(localStorage.getItem('showModal') == "false"){
      this.showModalVideo = false;
    }

    this.VIDEO_PATH = this.PATH1;
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     if (this.videoLand) {
  //       const media = this.videoLand.nativeElement;
  //       media.muted = true; // without this line it's not working although I have "muted" in HTML
  //       media.play();
  //     }
  //   }, 0);
  // }

  ngAfterViewInit(): void {
    if(this.modalChecked){
      console.log(this.modalChecked.nativeElement.checked)
    }
    
  }

  saveSelection(){
   if(this.modalChecked.nativeElement.checked){
      console.log('es verdadero')
      localStorage.setItem('showModal', JSON.stringify(false));
      console.log(JSON.parse(localStorage.getItem('showModal')));
   }else{
    console.log('es falso')
   }
    
  }

  replaceBiI_Markers() {
    this.previousText = this.bmxItem.componentText
    this._bmxService.currentprojectData$.subscribe((arg: any) => {
      if (!arg.bmxProjectName) {
        arg = JSON.parse(arg)
      }
      this.projectName = arg.bmxProjectName

      this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_PROJECTNAME', this.projectName);

      arg.bmxRegionalOffice.forEach((director: any, index: number) => {

     
    // let directorString =  `<div style="display: flex;justify-content: space-evenly; align-items: center;width: 90vw;">
    //     <div style="text-align: left;width: 400px;">
    //         <div >${director.name.trim()}</div>
    //         <div style="font-family: auto;
    //         font-size: 16px;
    //         font-style: italic;">${director.title.trim()}</div>
    //     </div>
    //     <div style="text-align: left;width: 300px;">${director.email.trim()}</div>
    //     <div style="text-align: left;width: 300px;">${director.phone.trim()}</div>
    //   </div>
    //   `

    // ENHANCED FOR MOBILE
    let directorString =  `
    <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
        <div style="font-family: auto;
        font-size: 23px;
        ">${director.name.trim()}</div>
        <div style="font-family: auto;
        font-size: 18px;
        font-style: italic;">${director.title.trim()}</div>
        <div style="font-family: auto;
        font-size: 18px;
        font-style: italic;">${director.email.trim()}</div>
        <div style="font-family: auto;
        font-size: 18px;
        font-style: italic;">${director.phone.trim()}</div>
      </div>
      <br>
      `

        if (index == 0) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR',directorString);
        } else if (index == 1) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR1',directorString);
        } else if (index == 2) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR2',directorString);
        } else if (index == 3) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR3',directorString);
        } else if (index == 4) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR4',directorString);
        }
      });

    });

  }

  editTextWithEditor(){
    this.bmxItem.componentText = this.previousText
  }

}
