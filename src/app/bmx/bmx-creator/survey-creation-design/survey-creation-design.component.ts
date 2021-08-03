import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-survey-creation-design',
  templateUrl: './survey-creation-design.component.html',
  styleUrls: ['./survey-creation-design.component.scss']
})
export class SurveyCreationDesignComponent implements OnInit {

  @Input() isMenuActive11;
  model = {
    editorData: '',
    namesData: ''
  };

  ckconfig: any;
  selectedIndex: any
  sampleHtml = `<p style="text-align:center;color:red">Instructions</p>\n\n<p style=\"text-align:justify\"><br />\nPlease select at least three &quot;themes&quot; you would consider to move forward for the Line Draw Family.</p>\n\n<p style=\"text-align:justify\"><strong>What do we mean by &quot;theme&quot;:</strong></p>\n\n<p style=\"text-align:justify\">We will develop names that pertain to an overarching theme. Each individual name candidate will have potential to be used as an ingredient brand to be used across all Line Draw Family concepts or as it pertains to each individual concept. In the latter scenario, we will develop names with a common word part and this word part will be included in each concept name. For example, if you choose the &quot;Optimized&quot; theme, we will develop candidates around the Op/Opt/Opti word parts.</p>\n\n<p style=\"text-align:justify\"><strong>How many themes should I vote on?</strong></p>\n\n<p style=\"text-align:justify\">You can select as many as you&rsquo;d like but we request that you select at least 3 themes. Based on the vote, we will select three to five themes for full creative exploration. How do I provide a vote? To make a selection, simply click the checkbox to the left of the desired name candidate. After you make a selection, you will be asked to rate that theme based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.</p>\n\n<p style=\"text-align:justify\">Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n`
  sampleHtml2 = `<p style="text-align:center;color:red">MORE TEXT OR PARGRAPTH</p>`
  selectedOption: any;
  rankingScaleValue = 5;
  // activeRatingStart = false;
  activeRatingStart0 = false;
  activeRatingStart1 = false;
  activeRatingStart2 = false;
  activeRatingStart3 = false;
  activeRatingStart4 = false;
  activeRatingStart5 = false;
  displayInstructions = false;

  selectedStarRatingIndex = ''
  selectedRating = 0;
  newTestNames = [];
  testNames = [
    {
      name: 'ASSIST', rationale: 'Sist, Assist, Syst', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'ENHANCE', rationale: 'Hance, En-', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'EVOLVE', rationale: 'Evo', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'GUARD', rationale: 'Gard, Guard', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'INVEST', rationale: 'In, Inv', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'OMNI', rationale: 'Omni', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'OPTIMAL', rationale: 'Opti, Opt, Op', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'SHIELD', rationale: 'Shield', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'SYNCHRONIZE', rationale: 'Synch, Sync', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'TRUSTED', rationale: 'Trus, Tru', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
    {
      name: 'NOMANER', rationale: 'referred', STARS: [
        {
          id: 1,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 2,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 3,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 4,
          icon: 'grade',
          class: 'rating-star'
        },
        {
          id: 5,
          icon: 'grade',
          class: 'rating-star'
        }

      ]
    },
  ];
  // SURVEY CREATOR VARIABLES & SCHEME
  brandMatrixObjects = [
    {
      componentType: 'logo-header',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
    {
      componentType: 'ranking-scale',
      componentText: this.testNames,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
    {
      componentType: 'instructions',
      componentText: this.sampleHtml,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    },
  ];

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
  }


  toggleInstructions() {
    this.displayInstructions = !this.displayInstructions;
  }

  checkDragEvetn(e) {
    console.log(e);
  }



  createNewBmxComponent() {
    window.scrollTo(300, 500);
    this.brandMatrixObjects.push({
      componentType: 'text-editor',
      componentText: this.sampleHtml2,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    })
  }

  createRankingComponent() {

    // parse string
    let parsedTestnames = ['ASSISTCV', 'ENHANCE', 'EVOLVE', 'GUARD', 'INVEST', 'OMNI', 'OPTIMAL', 'SHIELD', 'SYNCHRONIZE', 'TRUSTED', 'NOMANER']
    let ratingScale = 5;

    this.createNewDataObject(parsedTestnames,ratingScale);
    window.scrollTo(300, 500);
    this.brandMatrixObjects.push({
      componentType: 'ranking-scale',
      componentText: this.newTestNames,
      componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
    })
  }

  setRating(starId, testNameId) {

    // prevent multiple selection
    if (this.selectedRating === 0) {

      this.testNames[testNameId].STARS.filter((star) => {

        if (star.id <= starId) {

          star.class = 'active-rating-star';

        } else {

          star.class = 'rating-star';

        }

        return star;
      });

    }
  }

  selectStar(starId, testNameId): void {

    // prevent multiple selection
    if (this.selectedRating === 0) {

      this.testNames[testNameId].STARS.filter((star) => {

        if (star.id <= starId) {

          star.class = 'active-rating-star';

        } else {

          star.class = 'rating-star';

        }

        return star;
      });

    }

    // this.selectedRating = value;

  }


  createNewDataObject(parsedTestnames, ratingScale) {
    
    let startCounter: any = []

    // CREATE RATINGS NUMBER OF STARS OR SCALE
    for (let index = 0; index < ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: 'grade',
        class: 'rating-star'
      });
    }
    // create object
    parsedTestnames.forEach((name, index) => {
      this.newTestNames.push({ name: name, rationale: 'rat', STARS: startCounter })
    });

  }

}
