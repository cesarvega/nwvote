import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-survey-creation-design',
  templateUrl: './survey-creation-design.component.html',
  styleUrls: ['./survey-creation-design.component.scss']
})
export class SurveyCreationDesignComponent implements OnInit {

  @Input() isMenuActive11;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;

  TEMPLATE_NAME = 'Standart Personal Preference'

  model = {
    editorData: '',
    namesData: ''
  };
  TestNameDataModel: any;
  ckconfig: any;
  selectedIndex: any
  sampleHtml = `<p style="text-align:center;color:red">Instructions</p>\n\n<p style=\"text-align:justify\"><br />\nPlease select at least three &quot;themes&quot; you would consider to move forward for the Line Draw Family.</p>\n\n<p style=\"text-align:justify\"><strong>What do we mean by &quot;theme&quot;:</strong></p>\n\n<p style=\"text-align:justify\">We will develop names that pertain to an overarching theme. Each individual name candidate will have potential to be used as an ingredient brand to be used across all Line Draw Family concepts or as it pertains to each individual concept. In the latter scenario, we will develop names with a common word part and this word part will be included in each concept name. For example, if you choose the &quot;Optimized&quot; theme, we will develop candidates around the Op/Opt/Opti word parts.</p>\n\n<p style=\"text-align:justify\"><strong>How many themes should I vote on?</strong></p>\n\n<p style=\"text-align:justify\">You can select as many as you&rsquo;d like but we request that you select at least 3 themes. Based on the vote, we will select three to five themes for full creative exploration. How do I provide a vote? To make a selection, simply click the checkbox to the left of the desired name candidate. After you make a selection, you will be asked to rate that theme based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.</p>\n\n<p style=\"text-align:justify\">Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n`
  sampleHtml2 = `<p style="text-align:center;color:#324395;font-weight: 500;font-size: 25px;">USE THE EDITOR TO EDIT THIS TEXT</p>`
  selectedOption: any;
  rankingScaleValue = 5;

  displayInstructions = false;

  selectedStarRatingIndex = ''
  selectedRating = 0;
  newTestNames = [];
  ratingScale = 5;


  // TEMPLATE BOX 
  isTemplateBoxOn = false;
  isSaveOrUpdate = false;
  isOverViewPageOn = false;
  templateTitle;
  TEMPLATES = ['Standart Personal Preference', 'Ranking', 'NarrowDown', 'This or That', 'Naming Contest', 'Question & Answer'];
  templateName = '';
  selectedTemplateName = '';

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

  bmxPages: any = [
    {
      pageNumber: 1,
      page: this.brandMatrixObjects
    }
  ]

 

  BIG_OBJECT = {

    "Project_Info": {
      "bmxCompany": "The company name",
      "bmxDepartment": "Creative",
      "bmxLanguage": "English",
      "bmxProjectName": "103PED",
      "bmxRegion": "Basel 1",
      "bmxRegionalDirector": "undefined",
      "bmxRegionalOffice": [{ "nameCandidates": "William Johnson", "id": "1063", "title": "Global President", "email": "wjohnson@brandinstitute.com" }, { "nameCandidates": "Priya Patel", "id": "1411", "title": "Vice President, Brand Development - New York", "email": "ppatel@brandinstitute.com" }],
      "bmxSalesboard": "103PED",
    },

    "BMX": [

    ]


  }


  constructor() { }

  ngOnInit(): void {

    this.BIG_OBJECT = this.BIG_OBJECT

    // SAMPLE DATA FOR CKEDITOR
    this.model.editorData = this.sampleHtml;
    // TEMPLATE SELECTOR
    if (this.TEMPLATE_NAME === 'Standart Personal Preference') {
      this.createNewBmxComponent("rate-scale");
    }
    this.bmxPages = this.SAMPLE_BMX
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
// ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
    if (componentType === 'logo-header') {
      this.bmxPages[this.currentPage].page.push({
        componentType: 'logo-header',
        componentText: 'PROJECT NAME',
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', logoWidth: 100, 
        brandInstituteURL: "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
        companyLogoURL: "./assets/img/bmx/BD.png" }],
      })
    }// ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
    else if (componentType === 'text-editor') {
      this.bmxPages[this.currentPage].page.push({
        componentType: 'text-editor',
        componentText: this.sampleHtml2,
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
      })// ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
    } else if (componentType === 'rate-scale') {

      this.TestNameDataModel = [];
      this.TestNameDataModel.push({
        name: 'NAME', rationale: 'RATIONALE',
        STARS: this.createRatingStars()
      })
      for (let index = 0; index < 5; index++) {
        this.TestNameDataModel.push({
          name: 'TEST NAME ' + index,
          rationale: 'Rationale of an undisclosed length',
          RATE: -1,
          STARS: this.createRatingStars()
        })
      }
      this.bmxPages[this.currentPage].page.push({
        componentType: 'rate-scale',
        componentText: this.TestNameDataModel,
        componentSettings: [{
          "minRule": 0,
          "maxRule": 0,
          "fontSize": 16,
          "columnWidth": 150,
          "rationalewidth": 250,
          "rowHeight": 2,
          "categoryName": "Category Rate",
          "categoryDescription": "This is Rate matrix",
          "ratingScaleTitle": "RATING"
        }
        ],
      })
    }// ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
    else if (componentType === 'ranking-scale') {

      this.TestNameDataModel = [];
      this.TestNameDataModel.push({
        name: 'NAME', rationale: 'RATIONALE',
        STARS: this.createRankinScale()
      })
      for (let index = 0; index < 5; index++) {
        this.TestNameDataModel.push({
          name: 'TEST NAME ' + index,
          rationale: 'Rationale of an undisclosed length',
          RATE: 0,
          STARS: this.createRankinScale()
        })
      }
      this.bmxPages[this.currentPage].page.push({
        componentType: 'ranking-scale',
        componentText: this.TestNameDataModel,
        componentSettings: [{
          "minRule": 0,
          "maxRule": 0,
          "fontSize": 16,
          "columnWidth": 150,
          "rationalewidth": 250,
          "rowHeight": 2,
          "radioColumnsWidth": 75,
          "categoryName": "Category Ranking",
          "categoryDescription": "This is Ranking matrix",
          "ratingScaleTitle": "RANK",
          "rankType": "dropDown"
        }
        ],
      })
    }// ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
    else if (componentType === 'image-rate-scale') {

      this.TestNameDataModel = [];
      this.TestNameDataModel.push({
        name: 'LOGO', rationale: 'RATIONALE',
        STARS: this.createRatingStars()
      })
      for (let index = 0; index < 5; index++) {
        let imageIndex = index + 1
        this.TestNameDataModel.push({
          name: './assets/img/bmx/logoTestNames/logo' + imageIndex.toString() + '.JPG',
          nameCandidate: 'TEST NAME ' + index,
          rationale: 'Rationale of an undisclosed length',
          RATE: -1,
          STARS: this.createRatingStars()
        })
      }
      this.bmxPages[this.currentPage].page.push({
        componentType: 'image-rate-scale',
        componentText: this.TestNameDataModel,
        componentSettings: [{
          "minRule": 0,
          "maxRule": 0,
          "fontSize": 16,
          "columnWidth":  336,
          "rationalewidth": 250,
          "rowHeight": 2,
          "categoryName": "Category Logo Rating",
          "categoryDescription": "This is logo rating matrix",
          "ratingScaleTitle": "RANK"
        }
        ],
      })
    }// ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
    else if (componentType === 'narrow-down') {

      this.TestNameDataModel = [];
      this.TestNameDataModel.push({
        name: 'NAME', rationale: 'RATIONALE',
        STARS: this.createRatingStars()
      })
      for (let index = 0; index < 5; index++) {
        this.TestNameDataModel.push({
          name: 'NARROW TEST NAME ' + index,
          rationale: 'Rationale of an undisclosed length',
          RATE: -1,
          STARS: this.createRatingStars()
        })
      }
      this.bmxPages[this.currentPage].page.push({
        componentType: 'narrow-down',
        componentText: this.TestNameDataModel,
        componentSettings: [{
          "minRule": 0,
          "maxRule": 0,
          "fontSize": 16,
          "columnWidth": 150,
          "rationalewidth": 250,
          "rowHeight": 2,
          "categoryName": "Category Narrow Down",
          "categoryDescription": "This is narrow down matrix",
          "ratingScaleTitle": "RATING",
          "ratingScaleNarrowDownTitle": "SELECT 5 OUT OF 10"
        }
        ],
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

  deleteComponent(i) {
    this.bmxPages[this.currentPage].page.splice(i, 1)
  }


  // TEMPLATE METHODS
  saveOrUpdateTemplate(templateName) {
    localStorage.setItem(templateName, JSON.stringify(this.bmxPages))
    this.templateTitle = "Template '" + templateName + "' saved"

    if (this.TEMPLATES.indexOf(templateName) < 0) {
      this.TEMPLATES.push(templateName)
    }

    setTimeout(() => {
      this.openSaveTemplateBox()
    }, 1000);
  }

  loadTemplate(templateName) {
    if (localStorage.getItem(templateName)) {
      this.bmxPages = JSON.parse(localStorage.getItem(templateName))
    }
    this.openSaveTemplateBox()
  }

  templateSelected() {
    this.isSaveOrUpdate = true;
  }

  delete() {
    this.isTemplateBoxOn = true
  }

  openSaveTemplateBox() {
    this.templateName = ''
    this.templateTitle = 'save, update or load a template'
    this.isTemplateBoxOn = !this.isTemplateBoxOn
  }

  resetTemplate() {
    this.bmxPages = [
      {
        pageNumber: 1,
        page: [
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
        ]
      }
    ]
  }


  overviewPage() {

  }

  // 🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭PRIVATE METHODS 🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭
  createRatingStars() {
    let startCounter: any = []
    for (let index = 0; index < this.ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: 'grade',
        styleClass: 'rating-star'
      });
    }
    return startCounter;
  }
  createRankinScale() {
    let startCounter: any = []
    for (let index = 0; index < 3; index++) {
      startCounter.push({
        id: index,
        icon: index + 1,
        styleClass: 'rating-star'
      });
    }
    return startCounter;
  }

  saveData() {

    console.log('');

  }

  SAMPLE_BMX = [
    {
        "pageNumber": 1,
        "page": [
            {
                "componentType": "logo-header",
                "componentText": "PROJECT BLEND",
                "componentSettings": [
                    {
                        "fontSize": "16",
                        "fontFace": "Arial",
                        "logoWidth": 100,
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "narrow-down",
                "componentText": [
                    {
                        "name": "NAME",
                        "rationale": "RATIONALE",
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ]
                    },
                    {
                        "name": "TEST NAME 0",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ]
                    },
                    {
                        "name": "TEST NAME 1",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ]
                    },
                    {
                        "name": "TEST NAME 2",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ]
                    },
                    {
                        "name": "TEST NAME 3",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ]
                    },
                    {
                        "name": "TEST NAME 4",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ]
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 150,
                        "rationalewidth": 250,
                        "rowHeight": 2,
                        "categoryName": "Category Narrow Down",
                        "categoryDescription": "This is narrow down matrix",
                        "ratingScaleTitle": "RATING"
                    }
                ]
            }
        ]
    },
    {
        "pageNumber": 2,
        "page": [
            {
                "componentType": "logo-header",
                "componentText": "PROJECT NAME",
                "componentSettings": [
                    {
                        "fontSize": "16",
                        "fontFace": "Arial",
                        "fontColor": "red",
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><u>Instructions</u>:</p>\n\n<p><br />\nThe primary consideration for selection of a nonproprietary name is usefulness to health care practitioners; names should be accurately reflective of the substance they represent and easily distinguished from other existing nonproprietary names. Other aspects that enhance usefulness are brevity, memorability, and facility of pronunciation across multiple languages. Names should be free of promotional, numerical, and anatomical connotations; representations of chemical structure or mechanism-of-action should be restricted to the suffix portion of the name.<br />\n<br />\nPlease&nbsp;select all of the name candidates that you would categorize as&nbsp;neutral to positive. You should take into consideration any competitive name associations, pronunciation issues or negative connotations when making your selections.<br />\n<br />\nTo make a selection, simply click the check box to the left of the desired name candidate.<br />\n<br />\nAfter you make a selection, you will be asked to rate that name based on a set of criteria:<br />\n<br />\n<strong>Fit to Compound Concept:</strong><br />\n<br />\nPlease rate each selected name candidate based on how well it fits the compound concept on a scale from 1 to 7, 1 being average and 7 being excellent.<br />\n<br />\n<strong>Overall Likeability:</strong><br />\n<br />\nPlease rate each selected name candidate based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.<br />\n<br />\nYou can also provide comments in the text box titled&nbsp;General Comments.<br />\n<br />\nOnce you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.<br />\n<br />\n&nbsp;</p>\n\n<p style=\"text-align:center\"><u>Concept Statement:</u></p>\n\n<p><br />\n<br />\nBlackThorn Therapeutics is developing BTRX-335140, a selective a Kappa opioid receptor (KOR) antagonist, under development for the treatment of major depressive disorder.<br />\n<br />\nThe USAN/INN Expert Group has defined the stem &ndash;caprant&nbsp;for selective kappa opioid receptor antagonist. The stem &ndash;caprant&nbsp;was used in the recent nonproprietary name aticaprant (pINN 119/rINN 81) for another kappa opioid receptor antagonist and is appropriate for use in the nonproprietary name of BTRX-335140. The purpose of this BrandMatrix exercise is to select a nonproprietary name for BTRX-335140 that is appropriate and appealing.</p>\n",
                "componentSettings": [
                    {
                        "fontSize": "16",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "rate-scale",
                "componentText": [
                    {
                        "nameCandidates": "Name Candidates",
                        "rationale": "Rationales",
                        "CRITERIA": [
                            {
                                "name": "Fit to Compound Concept",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            },
                            {
                                "name": "Overall Likeability",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            }
                        ],
                        "Comments1": "General Comments"
                    },
                    {
                        "nameCandidates": "talorcaprant ",
                        "rationale": "Grab MDD By Talons",
                        "CRITERIA": [
                            {
                                "name": "Fit to Compound Concept",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            },
                            {
                                "name": "Overall Likeability",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "nameCandidates": "selocaprant ",
                        "rationale": "Selective",
                        "CRITERIA": [
                            {
                                "name": "Fit to Compound Concept",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            },
                            {
                                "name": "Overall Likeability",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "nameCandidates": "nelvecaprant ",
                        "rationale": "New/Novel",
                        "CRITERIA": [
                            {
                                "name": "Fit to Compound Concept",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            },
                            {
                                "name": "Overall Likeability",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "nameCandidates": "exacaprant ",
                        "rationale": "Exact - Speaks To Precision",
                        "CRITERIA": [
                            {
                                "name": "Fit to Compound Concept",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            },
                            {
                                "name": "Overall Likeability",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "nameCandidates": "rasocaprant ",
                        "rationale": "Raise Mood",
                        "CRITERIA": [
                            {
                                "name": "Fit to Compound Concept",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            },
                            {
                                "name": "Overall Likeability",
                                "STARS": [
                                    {
                                        "id": 0,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 1,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 2,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 3,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 4,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 5,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    },
                                    {
                                        "id": 6,
                                        "icon": "grade",
                                        "styleClass": "rating-star"
                                    }
                                ],
                                "RATE": -1
                            }
                        ],
                        "Comments1": "Comments"
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 275,
                        "rationalewidth": 490,
                        "rowHeight": 2,
                        "categoryName": "BTRX-335140 Name Candidates",
                        "categoryDescription": "category description",
                        "ratingScaleTitle": "CRITERIA"
                    }
                ]
            }
        ]
    },
    {
        "pageNumber": 3,
        "page": [
            {
                "componentType": "logo-header",
                "componentText": "PROJECT NAME",
                "componentSettings": [
                    {
                        "fontSize": "16",
                        "fontFace": "Arial",
                        "fontColor": "red",
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><u><span style=\"font-size:22px\">Instructions</span></u></p>\n\n<p><br />\n<span style=\"font-size:22px\">Please rank your&nbsp;top 5&nbsp;brand name candidates below based on your Personal Preference.</span></p>\n\n<p><span style=\"font-size:22px\">Please select &quot;1&quot; for your favorite name, &quot;2&quot; for your second favorite name, &quot;3&quot; for your third favorite name, &quot;4&quot; for your fourth favorite name, and &quot;5&quot; for your fifth favorite name. Feel free to provide comments next to any of the names (optional).</span></p>\n\n<p><span style=\"font-size:22px\">Once you have finished, please click &quot;Continue&quot; to proceed with the survey.</span><br />\n&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p style=\"text-align:center\"><u><span style=\"font-size:22px\">Concept Statement</span></u></p>\n\n<p><br />\n<br />\n<span style=\"font-size:22px\">XXX</span></p>\n\n<p style=\"text-align:center\">&nbsp;</p>\n",
                "componentSettings": [
                    {
                        "fontSize": "16",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "ranking-scale",
                "componentText": [
                    {
                        "name": "Name Candidates",
                        "rationale": "Rationales",
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "General Comments"
                    },
                    {
                        "name": "TEST NAME 1",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "TEST NAME 0",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "TEST NAME 4",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "TEST NAME 2",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "TEST NAME 3",
                        "rationale": "Rationale of an undisclosed length",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 305,
                        "rationalewidth": 544,
                        "rowHeight": 2,
                        "categoryName": "Category name",
                        "categoryDescription": "category description",
                        "ratingScaleTitle": "RANK"
                    }
                ]
            }
        ]
    },
    {
        "pageNumber": 4,
        "page": [
            {
                "componentType": "",
                "componentText": "",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "logo-header",
                "componentText": "PROJECT NAME",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red",
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><u>Instructions</u></p>\n\n<p><br />\nPlease rank your&nbsp;top 6&nbsp;nonproprietary name candidates below based on your Personal Preference.</p>\n\n<p>Please select &quot;1&quot; for your favorite name, &quot;2&quot; for your second favorite name, &quot;3&quot; for your third favorite name, &quot;4&quot; for your fourth favorite name, &quot;5&quot; for your fifth favorite name and &quot;6&quot; for your sixth favorite name. Feel free to provide comments next to any of the names (optional).</p>\n\n<p>Once you have finished, please click &quot;Continue&quot; to proceed with the survey.<br />\n&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p style=\"text-align:center\"><u>Concept Statement</u></p>\n\n<p><br />\n<br />\nAstraZeneca is developing AZD2373, an antisense oligonucleotide that inhibits synthesis of APOL1 protein for the treatment of chronic kidney disease.<br />\n<br />\nThe USAN/INN Expert Group has defined the -rsen&nbsp;suffix stem for antisense oligonucleotides. No antisense oligonucleotide against APOL1 has been named thus far, therefore we have devised the suffixes -aplorsen&nbsp;and -apolirsen&nbsp;to connote APOL1. As an antisense oligonucleotide targeting APOL1, this nomenclature is appropriate for use in the nonproprietary name of AZD2373. The purpose of this Brand Matrix exercise is to select a nonproprietary name for AZD2373that is appropriate and appealing.</p>\n",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "ranking-scale",
                "componentText": [
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Name Candidates",
                        "rationale": "Rationales",
                        "RadioColumn1": "1",
                        "RadioColumn2": "2",
                        "RadioColumn3": "3",
                        "RadioColumn4": "4",
                        "RadioColumn5": "5",
                        "RadioColumn6": "6",
                        "Comments2": "General Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "sivuzaplorsen ",
                        "rationale": "Individualized",
                        "RadioColumn1": true,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false,
                        "RadioColumn6": false,
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "ofasaplorsen ",
                        "rationale": "Blank Canvas",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": true,
                        "RadioColumn4": false,
                        "RadioColumn5": false,
                        "RadioColumn6": false,
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "beritapolirsen ",
                        "rationale": "Connotes Liberty",
                        "RadioColumn1": false,
                        "RadioColumn2": true,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false,
                        "RadioColumn6": false,
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "pelcirapolirsen ",
                        "rationale": "Precision Medicine",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": true,
                        "RadioColumn5": false,
                        "RadioColumn6": false,
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "pemapolirsen ",
                        "rationale": "Hope",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false,
                        "RadioColumn6": false,
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "talrapolirsen ",
                        "rationale": "Tailored",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": true,
                        "RadioColumn6": false,
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "vidnulapolirsen ",
                        "rationale": "Individualized",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false,
                        "RadioColumn6": true,
                        "Comments2": "Comments"
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 129,
                        "rationalewidth": 268,
                        "rowHeight": 2,
                        "categoryName": "AZD2373 Nonproprietary Name Candidates",
                        "categoryDescription": "category description",
                        "ratingScaleTitle": "RANK"
                    }
                ]
            }
        ]
    },
    {
        "pageNumber": 5,
        "page": [
            {
                "componentType": "",
                "componentText": "",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "logo-header",
                "componentText": "PROJECT NAME",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red",
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><u>Instructions</u></p>\n\n<p><br />\nPlease select your favorite logo candidates based on your&nbsp;personal preference&nbsp;on a scale from 1 to 7: 1 being negative, 4 being average and 7 being excellent. Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "image-rate-scale",
                "componentText": [
                    {
                        "name": "LOGO",
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 6,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "General Comments"
                    },
                    {
                        "name": "./assets/img/bmx/logoTestNames/logo1.JPG",
                        "nameCandidate": "TEST NAME 0",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 6,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "./assets/img/bmx/logoTestNames/logo2.JPG",
                        "nameCandidate": "TEST NAME 1",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 6,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "./assets/img/bmx/logoTestNames/logo3.JPG",
                        "nameCandidate": "TEST NAME 2",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 6,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "./assets/img/bmx/logoTestNames/logo4.JPG",
                        "nameCandidate": "TEST NAME 3",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 6,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    },
                    {
                        "name": "./assets/img/bmx/logoTestNames/logo5.JPG",
                        "nameCandidate": "TEST NAME 4",
                        "RATE": -1,
                        "STARS": [
                            {
                                "id": 0,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 5,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 6,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "Comments1": "Comments"
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 336,
                        "rationalewidth": 250,
                        "rowHeight": 2,
                        "categoryName": "Category name",
                        "categoryDescription": "category description",
                        "ratingScaleTitle": "RANK"
                    }
                ]
            }
        ]
    }
]


}


