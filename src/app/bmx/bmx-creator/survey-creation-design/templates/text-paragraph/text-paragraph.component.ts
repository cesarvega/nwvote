import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

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
  selectedIndex
  ckconfig: { allowedContent: boolean; width: string; contentsCss: string[]; height: number; forcePasteAsPlainText: boolean; toolbarLocation: string; toolbarGroups: ({ name: string; groups: string[]; } | { name: string; groups?: undefined; })[]; addPlugins: string; removePlugins: string; removeButtons: string; };
  constructor() { }

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
  }

}
