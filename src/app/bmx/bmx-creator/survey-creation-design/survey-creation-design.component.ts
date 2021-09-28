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

  SAMPLE_BMX = [
    {
      "pageNumber": 1,
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
          "componentText": "<p style=\"text-align:center\">Instructions</p>\n\n<p style=\"text-align:justify\">Please select&nbsp;only&nbsp;the name candidates that you would categorize as&nbsp;<strong>neutral to positive</strong>&nbsp;You should take into consideration any competitive brand name associations, pronunciation issues or negative connotations when making your selections. To make a selection, simply click the check box to the left of the desired name candidate. After you make a selection, you will be asked to rate that name based on a set of criteria:&nbsp;<strong>Fit to Product Concept:</strong> Please rate each selected name candidate based on how well it fits the product concept on a scale from 1 to 7, 1 being average and 7 being excellent.&nbsp;<strong>Overall Likeability:</strong> Please rate each selected name candidate based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked. Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n\n<p style=\"text-align:justify\">&nbsp;</p>\n\n<p style=\"text-align:center\">Concept Statement</p>\n\n<p>cvegaCS</p>\n\n<p style=\"text-align:justify\">&nbsp;</p>\n\n<p style=\"text-align:justify\">&nbsp;</p>\n",
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
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "NAME",
              "rationale": "RATIONALE",
              "katakana": "KATAKANA"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 0",
              "rationale": "Rationale of an unth",
              "katakana": "片仮名、カタカナ",
              "RATE": 0
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 1",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 2",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED 3",
              "rationale": "Rationale of an losed length",
              "katakana": "片仮名、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 4",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "NAME 5",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME ",
              "rationale": "Rationale of an unlosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed length",
              "katakana": "タカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 7",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カタカナ"
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
              "categoryName": "Category name",
              "categoryDescription": "category description"
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
          "componentText": "<p style=\"text-align:center\">Instructions</p>\n\n<p>Please select&nbsp;only&nbsp;the name candidates that you would categorize as&nbsp;neutral to positive&nbsp;You should take into consideration any competitive brand name associations, pronunciation issues or negative connotations when making your selections. To make a selection, simply click the check box to the left of the desired name candidate. After you make a selection, you will be asked to rate that name based on a set of criteria:&nbsp;Fit to Product Concept: Please rate each selected name candidate based on how well it fits the product concept on a scale from 1 to 7, 1 being average and 7 being excellent.&nbsp;Overall Likeability: Please rate each selected name candidate based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked. Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n\n<p style=\"text-align:center\">Concept Statement</p>\n",
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
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "NAME",
              "rationale": "RATIONALE",
              "katakana": "KATAKANA"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 0",
              "rationale": "Rationale of an unth",
              "katakana": "片仮名、カタカナ",
              "RATE": 0
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 1",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 2",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED 3",
              "rationale": "Rationale of an losed length",
              "katakana": "片仮名、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 4",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "NAME 5",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カタカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME ",
              "rationale": "Rationale of an unlosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed length",
              "katakana": "タカナ"
            },
            {
              "STARS": [
                {
                  "id": 0,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 1,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 2,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 3,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 4,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 5,
                  "icon": "grade",
                  "class": "rating-star"
                },
                {
                  "id": 6,
                  "icon": "grade",
                  "class": "rating-star"
                }
              ],
              "name": "LOADED NAME 7",
              "rationale": "Rationale of an undisclosed length",
              "katakana": "片仮名、カタカナ"
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
              "categoryName": "Category name",
              "categoryDescription": "category description"
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
          "componentText": "<p style=\"text-align:center\"><span style=\"font-size:22px\">Thank you for participating. Your responses have been recorded.<br />\n<br />\nPlease feel free to provide new name candidate suggestions in the text box below (optional). When you are finished, please click &quot;Submit&quot; to complete the survey.</span></p>\n\n<p style=\"text-align:center\">&nbsp;</p>\n",
          "componentSettings": [
            {
              "fontSize": "16",
              "fontFace": "Arial",
              "fontColor": "red"
            }
          ]
        }
      ]
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
      "bmxRegionalOffice": [{"name": "William Johnson", "id": "1063", "title": "Global President", "email": "wjohnson@brandinstitute.com"},{ "name": "Priya Patel", "id": "1411", "title": "Vice President, Brand Development - New York", "email": "ppatel@brandinstitute.com"}],
      "bmxSalesboard": "103PED",
    },

    "BMX" : [
     
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

    if (componentType === 'logo-header') {
      this.bmxPages[this.currentPage].page.push({
        componentType: 'logo-header',
        componentText: 'PROJECT NAME',
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
      })
    }
    else if (componentType === 'text-editor') {
      this.bmxPages[this.currentPage].page.push({
        componentType: 'text-editor',
        componentText: this.sampleHtml2,
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
      })
    } else if (componentType === 'rate-scale') {

      this.TestNameDataModel = [];
      this.TestNameDataModel.push({
        name: 'NAME', rationale: 'RATIONALE',
        STARS: this.createRatingStars()
      })
      for (let index = 0; index < 6; index++) {
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
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
      })
    }
    else if (componentType === 'ranking-scale') {

      this.TestNameDataModel = [];
      this.TestNameDataModel.push({
        name: 'NAME', rationale: 'RATIONALE',
        STARS: this.createRateScale()
      })
      for (let index = 0; index < 12; index++) {
        this.TestNameDataModel.push({
          name: 'TEST NAME ' + index,
          rationale: 'Rationale of an undisclosed length',
          RATE: -1,
          STARS: this.createRateScale()
        })
      }
      this.bmxPages[this.currentPage].page.push({
        componentType: 'ranking-scale',
        componentText: this.TestNameDataModel,
        componentSettings: [{ fontSize: '16px', fontFace: 'Arial', fontColor: 'red' }],
      })
    }
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
          rationale: 'Rationale of an undisclosed length',
          RATE: -1,
          STARS: this.createRatingStars()
        })
      }
      this.bmxPages[this.currentPage].page.push({
        componentType: 'image-rate-scale',
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
        class: 'rating-star'
      });
    }
    return startCounter;
  }
  createRateScale() {
    let startCounter: any = []
    for (let index = 0; index < this.ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: index + 1,
        class: 'rating-star'
      });
    }
    return startCounter;
  }

  saveData() {

    console.log('');

  }


}


