import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participants-email',
  templateUrl: './participants-email.component.html',
  styleUrls: ['./participants-email.component.scss']
})
export class ParticipantsEmailComponent implements OnInit {
  ckconfig: any;
  selectedIndex: any
  sampleHtml = `Dear PARTICIPANT,
  You have been selected to participate in the brand name selection for BI Pharma's new ADSSK & CCC Inhibitor for the treatment of multiple cancer types. 
  In this survey, you'll be voting on multiple name candidates that have been developed specifically for this compound. The survey will guide you, and an instructions button is available at any time for your assistance.
  We hope you enjoy this piece of your branding process. Please select Continue below to officially start your survey. 
  Best,
  The Brand Institute Team`
  selectedOption: any;
  LINK_TYPE = [
    { name: 'Direct Link', rationale: 'Sist, Assist, Syst' },
    { name: 'General Link', rationale: 'Hance, En-' },
  ];
 
  EMAIL_TEMPLATES = [
    { name: 'Clinical Trial', rationale: 'Sist, Assist, Syst' },
    { name: 'Consumer', rationale: 'Hance, En-' },
    { name: 'Contest/Namepage', rationale: 'Evo' },
    { name: 'Nonproprietary Name', rationale: 'Gard, Guard' },
    { name: 'Nonproprietary Suffix', rationale: 'Gard, Guard' },
    { name: 'Logo', rationale: 'Gard, Guard' },
    { name: 'Pharmaceutical/Rx', rationale: 'Gard, Guard' }
  ];

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

  constructor() {
    
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


}
