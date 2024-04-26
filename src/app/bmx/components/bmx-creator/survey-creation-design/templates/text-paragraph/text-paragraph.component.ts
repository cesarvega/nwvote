import { Component, AfterViewInit, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { BmxService } from '../../../bmx.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BlockToolbar } from '@ckeditor/ckeditor5-ui';
import { HeadingButtonsUI } from '@ckeditor/ckeditor5-heading';
import { ParagraphButtonUI } from '@ckeditor/ckeditor5-paragraph';
@Component({
  selector: 'app-text-paragraph',
  templateUrl: './text-paragraph.component.html',
  styleUrls: ['./text-paragraph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextParagraphComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @Input() currentPage;
  @Input() template;

  openSettings = false
  ckconfig;
  projectName: any;
  previousText = '';
  Editor = ClassicEditor;
  config = {};
  constructor(private _bmxService: BmxService) { }

  ngOnInit(): void {
    this.config = {
      blockToolbar: [
        'paragraph', 'heading1', 'heading2', 'heading3',
        '|',
        'bulletedList', 'numberedList',
        '|',
        'blockQuote', 'uploadImage'
    ],
      toolbar: {
        items: [
          'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
          'fontSize', 'fontFamily', '|', 'color', 'backgroundColor', '|',
          'alignment', '|', 'numberedList', 'bulletedList', '|',
          'indent', 'outdent', '|', 'link', 'blockquote', 'imageUpload', '|',
          'undo', 'redo', '|', 'code', 'codeBlock'
        ]
      },
      image: {
        toolbar: [
          'imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn', 'tableRow', 'mergeTableCells', '|', 'tableProperties', 'tableCellProperties'
        ]
      },
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
          // More heading options...
        ]
      },
      // plugins: 'BlockToolbar',
      // removePlugins: 'horizontalrule,specialchar,about,others',
      removeButtons: 'Smiley,tableselection,Image,Save,NewPage,Preview,Print,Templates,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Find,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,Flash,PageBreak,Iframe,ShowBlocks,Cut,Copy,Paste,Table,Format,Source,Maximize,Styles,Anchor,SpecialChar,PasteFromWord,PasteText,Scayt,RemoveFormat,Indent,Outdent,Blockquote',
      basicstyles: { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] } // Aquí se añadieron 'Subscript' y 'Superscript'
      // Additional configurations...
    };
    this.previousText = this.bmxItem.componentText
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
        let directorString = `
    <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
        <div style="
        font-size: 23px;
        font-family: sofia-pro;
        line-height: 1.5
        ">${director.name.trim()}</div>
        <div style="
        font-size: 18px;
        font-family: sofia-pro;
        line-height: 1.5
        ">${director.title.trim()}</div>
        <div style="font-family: auto;
        font-size: 18px;
        font-family: sofia-pro;
        line-height: 1.5
        ">${director.email.trim()}</div>
        <div style="font-family: auto;
        font-size: 18px;
        font-family: sofia-pro;
        line-height: 1.5
        ">${director.phone.trim()}</div>
      </div>
      <br>
      `

        if (index == 0) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR', directorString);
        } else if (index == 1) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR1', directorString);
        } else if (index == 2) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR2', directorString);
        } else if (index == 3) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR3', directorString);
        } else if (index == 4) {
          this.bmxItem.componentText = this.bmxItem.componentText.replace('BI_DIRECTOR4', directorString);
        }
      });

    });

  }

  editTextWithEditor() {
    this.bmxItem.componentText = this.previousText
  }

}
