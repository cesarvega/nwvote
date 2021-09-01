import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-survey-creation-design',
  templateUrl: './survey-creation-design.component.html',
  styleUrls: ['./survey-creation-design.component.scss']
})
export class SurveyCreationDesignComponent implements OnInit {

  @Input() isMenuActive11;

  TEMPLATE_NAME = 'Standart Personal Preference'

  model = {
    editorData: '',
    namesData: ''
  };
  TestNameDataModel: any;
  ckconfig: any;
  selectedIndex: any
  sampleHtml = `<p style="text-align:center;color:red">Instructions</p>\n\n<p style=\"text-align:justify\"><br />\nPlease select at least three &quot;themes&quot; you would consider to move forward for the Line Draw Family.</p>\n\n<p style=\"text-align:justify\"><strong>What do we mean by &quot;theme&quot;:</strong></p>\n\n<p style=\"text-align:justify\">We will develop names that pertain to an overarching theme. Each individual name candidate will have potential to be used as an ingredient brand to be used across all Line Draw Family concepts or as it pertains to each individual concept. In the latter scenario, we will develop names with a common word part and this word part will be included in each concept name. For example, if you choose the &quot;Optimized&quot; theme, we will develop candidates around the Op/Opt/Opti word parts.</p>\n\n<p style=\"text-align:justify\"><strong>How many themes should I vote on?</strong></p>\n\n<p style=\"text-align:justify\">You can select as many as you&rsquo;d like but we request that you select at least 3 themes. Based on the vote, we will select three to five themes for full creative exploration. How do I provide a vote? To make a selection, simply click the checkbox to the left of the desired name candidate. After you make a selection, you will be asked to rate that theme based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.</p>\n\n<p style=\"text-align:justify\">Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n`
  sampleHtml2 = `<p style="text-align:center;color:red">MORE TEXT OR PARGRAPTH</p>`
  selectedOption: any;
  rankingScaleValue = 5;

  displayInstructions = false;

  selectedStarRatingIndex = ''
  selectedRating = 0;
  newTestNames = [];
  ratingScale = 5;

  // SURVEY CREATOR VARIABLES & SCHEME

  currentPage = 0;

  brandMatrixObjects = [
    {
      componentType: 'logo-header',
      componentText: 'PROJECT NAME',
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
    {
      componentType: 'instructions',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
  ];

  bmxPages = [
    {
      pageNumber: 1,
      page: this.brandMatrixObjects
    }
  ]

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
    // SAMPLE DATA FOR CKEDITOR
    this.model.editorData = this.sampleHtml;
    // TEMPLATE SELECTOR
    if (this.TEMPLATE_NAME === 'Standart Personal Preference') {
      this.createNewBmxComponent("rating-scale");
    }
    // this.bmxPages.push( {
    //   pageNumber: 1,
    //   page: this.brandMatrixObjects
    // })
  }

  toggleInstructions() {
    this.displayInstructions = !this.displayInstructions;
  }

  checkDragEvetn(e) {
    console.log(e);
  }

  createPage() {
    this.bmxPages.push({
      pageNumber: this.bmxPages.length + 1,
      page: [{
        componentType: '',
        componentText: '',
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }]
      }]
    })
  }

  createNewBmxComponent(componentType) {
    if (componentType === 'text-editor') {
      this.bmxPages[this.currentPage].page.push({
        componentType: 'text-editor',
        componentText: this.sampleHtml2,
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
      })
    } else if (componentType === 'rating-scale') {

      this.TestNameDataModel = [];
      this.TestNameDataModel.push({
        name: 'NAME', rationale: 'RATIONALE',
        STARS: this.createRatingStars()
      })
      for (let index = 0; index < 12; index++) {
        this.TestNameDataModel.push({
          name: 'TEST NAME ' + index, 
          rationale: 'Rationale of an undisclosed length',
          RATE:-1,
          STARS: this.createRatingStars()
        })
      }
      this.bmxPages[this.currentPage].page.push({
        componentType: 'ranking-scale',
        componentText: this.TestNameDataModel,
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
      })
    }

  }

  changePage(direction) {
    if (direction === 'next' && this.bmxPages.length - 1 > this.currentPage) {
      this.currentPage = this.currentPage + 1;
    } else if (direction === 'previous' && this.currentPage >= 1) {
      this.currentPage = this.currentPage - 1;
    }
  }
  selectPageNumber(pageNumber) {
    this.currentPage = pageNumber;
  }


  // 🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭PRIVATE METHODS 🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭
  createRatingStars() {
    let startCounter: any = []
    for (let index = 0; index < this.ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: 'grade',
        class: 'rating-star'
      });
    }
    return startCounter;
  }

  saveData() {

    console.log('');

  }

  createTemplate(template){

    localStorage.setItem(template, JSON.stringify(this.bmxPages))

  }


  loadTemplate(template){

    this.bmxPages = JSON.parse(localStorage.getItem('template1'))
  }

  
  deleteComponent(i){
    this.bmxPages[this.currentPage].page.splice(i, 1)
  }

}
