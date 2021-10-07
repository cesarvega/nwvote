import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
// import { Nw3Service } from './nw3.service';
import { ActivatedRoute } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';
// import { Nw3Service } from '../../nw3/nw3.service';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BmxCreatorComponent } from '../bmx-creator.component';

@Component({
  selector: 'app-survey-matrix',
  templateUrl: './survey-matrix.component.html',
  styleUrls: ['./survey-matrix.component.scss']
})
export class SurveyMatrixComponent extends BmxCreatorComponent implements OnInit {
  @Input() isMenuActive11;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  username: any;
  bmxPagesClient
  constructor(@Inject(DOCUMENT)  document: any,
    activatedRoute: ActivatedRoute,
   _hotkeysService: HotkeysService,  dragulaService: DragulaService,  _BmxService: BmxService) {
   
    super(document,activatedRoute, _hotkeysService, dragulaService, _BmxService)

    activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      this.username = params['username'];
      localStorage.setItem('projectId',  this.projectId);
      // this.bsrService.getProjectData(this.projectId).subscribe(arg => {
      //   this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
      //   localStorage.setItem('projectName',  this.projectId);        
      // });
    });
  }

  ngOnInit(): void {
   

// this.bmxPagesClient = this.SAMPLE_BMX
    this.toggleMenuActive('isMenuActive11')
    this.isMainMenuActive = false;
    this.bmxClientPageDesignMode = false;
    this.bmxClientPageOverview = false;
    this.displayRightSideMenu = false;
    this.isMobile = true
  }
  SAMPLE_BMX = [
    {
        "pageNumber": 1,
        "page": [
            {
                "componentType": "logo-header",
                "componentText": "PROJECT NAME",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "logoWidth": 100,
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><u>Instructions</u></p>\n\n<p style=\"text-align:center\">&nbsp;</p>\n\n<p style=\"text-align:justify\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Please select&nbsp;only&nbsp;the name candidates that you would categorize as&nbsp;<strong>neutral to positive</strong>&nbsp;</p>\n\n<p style=\"text-align:justify\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;You should take into consideration any competitive brand name associations, pronunciation issues or negative connotations when making your selections.</p>\n\n<p style=\"text-align:justify\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;To make a selection, simply click the check box to the left of the desired name candidate.</p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;After you make a selection, you will be asked to rate that name based on your&nbsp;<strong>Personal Preference</strong>:</p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Please rate each selected name candidate based on your own personal preference on a scale from <strong>1</strong> to <strong>7</strong>, <strong>1</strong> being neutral and <strong>7</strong> being the most liked.</p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;There is no ranking for negative as these names are not to be selected</p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to complete the survey.</p>\n",
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Name Candidates",
                        "rationale": "Rationales",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "TEMPORAL  ",
                        "rationale": "Treatment to Slow Parkinson’s Given Orally",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Moderato  ",
                        "rationale": "A Moderate Musical Tempo (Suggests Slowing Disease Progression)",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "REINSPIRE ",
                        "rationale": "Reviewing an Early Intervention for Slowing Parkinson's Disease Progression - Give Hope, Links to UCB's \"Inspired by Patients\"",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "MILKY WAY  ",
                        "rationale": "MIsfolding Parkinson Study With Early Stage Patients",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Arkitect ",
                        "rationale": "\"Architect,\" Embeds Ark for Parkinson's Disease and Implies Stability or Planning Ahead",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Unfolding ",
                        "rationale": "A Slow Revealing, Suggests Slowing Disease Progression and Links to Alpha-Synuclein Misfolding",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                            },
                            {
                                "id": 7,
                                "icon": "grade",
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "ORCHESTRA  ",
                        "rationale": "ORal New Chemical Entity Aiming to Slow Disease Trajectory in Early Parkinson’s",
                        "Comments1": "General Comments"
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 191,
                        "rationalewidth": 804,
                        "rowHeight": 2,
                        "categoryName": "Name Candidates",
                        "categoryDescription": "",
                        "ratingScaleTitle": "Rate from 1 to 7"
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
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "logoWidth": 100,
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
                        "CRITERIA": true,
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
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "logoWidth": 100,
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
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "ExtraColumn1": "NAME",
                        "rationale": "RATIONALE",
                        "Comments2": "General Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "ExtraColumn1": "TEST NAME 1",
                        "rationale": "Rationale of an losed length",
                        "Comments2": "General Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "ExtraColumn1": "TEST NAME 2",
                        "rationale": "Rationale of an undisclosed length",
                        "Comments2": "General Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "ExtraColumn1": "TEST NAME 3",
                        "rationale": "Rationale of an undisclosed length",
                        "Comments2": "General Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "ExtraColumn1": "TEST NAME 4",
                        "rationale": "Rationale of an losed length",
                        "Comments2": "General Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "ExtraColumn1": "TEST NAME 5",
                        "rationale": "Rationale of an undisclosed length",
                        "Comments2": "General Comments"
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
                        "radioColumnsWidth": 75,
                        "categoryName": "Category Ranking",
                        "categoryDescription": "This is Ranking matrix",
                        "ratingScaleTitle": "RANK",
                        "rankType": "dropDown"
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
                        "logoWidth": 100,
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
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Name Candidates",
                        "rationale": "Rationales",
                        "Comments2": "General Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "sivuzaplorsen ",
                        "rationale": "Individualized",
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "ofasaplorsen ",
                        "rationale": "Blank Canvas",
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "beritapolirsen ",
                        "rationale": "Connotes Liberty",
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "talrapolirsen ",
                        "rationale": "Tailored",
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "pemapolirsen ",
                        "rationale": "Hope",
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "pelcirapolirsen ",
                        "rationale": "Precision Medicine",
                        "Comments2": "Comments"
                    },
                    {
                        "STARS": [
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "vidnulapolirsen ",
                        "rationale": "Individualized",
                        "Comments2": "Comments"
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 221,
                        "rationalewidth": 268,
                        "rowHeight": 2,
                        "categoryName": "AZD2373 Nonproprietary Name Candidates",
                        "categoryDescription": "category description",
                        "ratingScaleTitle": "RANK",
                        "rankType": "dragAndDrop",
                        "radioColumnsWidth": 95
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
                        "logoWidth": 100,
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><u>Instructions</u></p>\n\n<p><br />\nPlease select your favorite logo candidates based on your&nbsp;personal preference&nbsp;on a scale from 1 to 5: 1 being negative, 3 being average and 5 being excellent. Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n",
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
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Name Candidates",
                        "rationale": "Rationale",
                        "RadioColumn1": 1,
                        "RadioColumn2": 2,
                        "RadioColumn3": 3,
                        "RadioColumn4": 4,
                        "RadioColumn5": 5
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Pledge  ",
                        "rationale": "A Promise or Oath, Embeds P and D for Parkinson's Disease",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Opening  ",
                        "rationale": "Onset, Beginning (i.e., an Early Treatment)",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "SUSPEND  ",
                        "rationale": "Study of UCB0599's Slowing of the Progression of Early Parkinson's Disease - Delay",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Placid  ",
                        "rationale": "Calm, Steady, Stable, Begins in P and Ends with D to Suggest Parkinson's Disease",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "At Dawn ",
                        "rationale": "Suggests Early Treatment",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Skylark  ",
                        "rationale": "Type of Bird, May Connote Freedom or Taking Flight, Links to Parkinson's Disease",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Pearly  ",
                        "rationale": "Shining Like a Pearl (May Suggest Hope), Implies Treating Parkinson's Disease (P-) Early",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "STEADY  ",
                        "rationale": "Study Testing an Early Parkinson's Disease Therapy - Suggests Stabilizing Symptoms, Gaining Control",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "PositiveDirection ",
                        "rationale": "A Hopeful Step Forward, Uses P and D for Parkinson's Disease",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Moderato  ",
                        "rationale": "A Moderate Musical Tempo (Suggests Slowing Disease Progression)",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "REINSPIRE ",
                        "rationale": "Reviewing an Early Intervention for Slowing Parkinson's Disease Progression - Give Hope, Links to UCB's \"Inspired by Patients\"",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Bloom  ",
                        "rationale": "Symbolic of Tulips and a Brighter Future",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
                    },
                    {
                        "STARS": [
                            {
                                "id": 0,
                                "icon": 1,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 1,
                                "icon": 2,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 2,
                                "icon": 3,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 3,
                                "icon": 4,
                                "styleClass": "rating-star"
                            },
                            {
                                "id": 4,
                                "icon": 5,
                                "styleClass": "rating-star"
                            }
                        ],
                        "nameCandidates": "Embark  ",
                        "rationale": "To Set Out on a Journey, May Connote Optimism or Hope, Links to Parkinson's Disease",
                        "RadioColumn1": false,
                        "RadioColumn2": false,
                        "RadioColumn3": false,
                        "RadioColumn4": false,
                        "RadioColumn5": false
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
                        "radioColumnsWidth": 75,
                        "categoryName": "Category Ranking",
                        "categoryDescription": "This is Ranking matrix",
                        "ratingScaleTitle": "RANK",
                        "rankType": "radio"
                    }
                ]
            }
        ]
    },
    {
        "pageNumber": 6,
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
                        "logoWidth": 100,
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><u>Instructions</u></p>\n\n<p><br />\nPlease select&nbsp;only&nbsp;the name candidates that you would categorize as&nbsp;<strong>neutral to positive</strong>.</p>\n\n<p>You should take into consideration any competitive brand name associations, pronunciation issues or negative connotations when making your selections.</p>\n\n<p>To make a selection, simply click the check box to the left of the desired name candidate.</p>\n\n<p>After you make a selection, you will be asked to rate that name based on your&nbsp;<strong>Personal Preference</strong>:</p>\n\n<p>Please rate each selected name candidate based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.</p>\n\n<p>There is no ranking for negative as these names are not to be selected</p>\n\n<p>Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to complete the survey.</p>\n",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "narrow-down",
                "componentText": [
                    {
                        "STARS": [
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
                        "rationale": "Rationale",
                        "katakana": "Katakana",
                        "SELECTED_ROW": false
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "Test 1",
                        "rationale": "Rationale of an unthRationale of an unthdddd dddddddd dddddddd ddddddddddd ddddddd dddddddd",
                        "katakana": "片仮名、カタカナ",
                        "SELECTED_ROW": true
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "Test 2",
                        "rationale": "Rationale of an undisclosed length",
                        "katakana": "片仮名、カタカナ",
                        "SELECTED_ROW": false
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "Test 3",
                        "rationale": "Rationale of an undisclosed length",
                        "katakana": "片仮名、カナ",
                        "SELECTED_ROW": false
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "Test 4",
                        "rationale": "Rationale of an losed length",
                        "katakana": "片仮名、カタカナ",
                        "SELECTED_ROW": false
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "Test 5",
                        "rationale": "Rationale of an undisclosed length",
                        "katakana": "、カタカナ",
                        "SELECTED_ROW": false
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "Test 6",
                        "rationale": "Rationale of an undisclosed length",
                        "katakana": "片仮名、カタカナ",
                        "SELECTED_ROW": false
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 221,
                        "rationalewidth": 452,
                        "rowHeight": 2,
                        "categoryName": "Category Narrow Down",
                        "categoryDescription": "This is narrow down matrix",
                        "ratingScaleTitle": "RATING",
                        "ratingScaleNarrowDownTitle": "SELECT 5 OUT OF 10"
                    }
                ]
            }
        ]
    },
    {
        "pageNumber": 7,
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
                        "logoWidth": 100,
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\">Instructions</p>\n\n<p><br />\nPlease select your favorite logo candidates based on your&nbsp;personal preference&nbsp;on a scale from 1 to 7: 1 being negative, 4 being average and 7 being excellent. Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n",
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
                        "STARS": [
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
                        "rationale": "Rationale",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "https://tools.brandinstitute.com/bmresources/103PED/logo1.JPG",
                        "rationale": "Rationale of an unthRationale of an unthdddd dddddddd dddddddd ddddddddddd ddddddd dddddddd",
                        "name": "https://tools.brandinstitute.com/bmresources/103PED/logo1.JPG",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "https://tools.brandinstitute.com/bmresources/103PED/logo2.JPG",
                        "rationale": "Rationale of an undisclosed length",
                        "name": "https://tools.brandinstitute.com/bmresources/103PED/logo2.JPG",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "https://tools.brandinstitute.com/bmresources/103PED/logo3.JPG",
                        "rationale": "Rationale of an undisclosed length",
                        "name": "https://tools.brandinstitute.com/bmresources/103PED/logo3.JPG",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "https://tools.brandinstitute.com/bmresources/103PED/logo4.JPG",
                        "rationale": "Rationale of an losed length",
                        "name": "https://tools.brandinstitute.com/bmresources/103PED/logo4.JPG",
                        "Comments1": "General Comments"
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "https://tools.brandinstitute.com/bmresources/103PED/logo5.JPG",
                        "rationale": "Rationale of an undisclosed length",
                        "name": "https://tools.brandinstitute.com/bmresources/103PED/logo5.JPG",
                        "Comments1": "General Comments"
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 336,
                        "rationalewidth": 375,
                        "rowHeight": 2,
                        "categoryName": "Category Logo Rating",
                        "categoryDescription": "This is logo rating matrix",
                        "ratingScaleTitle": "RANK"
                    }
                ]
            }
        ]
    },
    {
        "pageNumber": 8,
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
                        "logoWidth": 100,
                        "brandInstituteURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                        "companyLogoURL": "./assets/img/bmx/BD.png"
                    }
                ]
            },
            {
                "componentType": "text-editor",
                "componentText": "<p style=\"text-align:center\"><span style=\"font-size:72px\">Q &amp; A</span></p>\n",
                "componentSettings": [
                    {
                        "fontSize": "16px",
                        "fontFace": "Arial",
                        "fontColor": "red"
                    }
                ]
            },
            {
                "componentType": "question-answer",
                "componentText": [
                    {
                        "STARS": [
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
                        "nameCandidates": "Questions",
                        "Answers1": "Answers"
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What treatments can help my dog with congestive heart failure?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What are the symptoms that you may see as your dog's congestive heart failure gets worse?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What are the early symptoms of heart failure in dogs?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "How do you treat liver disease in dogs?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What are symptoms of liver disease in dogs?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What happens after my dog gets a heartworm treatment?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What are the symptoms of pancreatitis in dogs?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What are the symptoms of seizures in dogs?",
                        "Answers1": ""
                    },
                    {
                        "STARS": [
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
                        "nameCandidates": "What is the treatment for pancreatitis in dogs?",
                        "Answers1": ""
                    }
                ],
                "componentSettings": [
                    {
                        "minRule": 0,
                        "maxRule": 0,
                        "fontSize": 16,
                        "columnWidth": 600,
                        "rationalewidth": 250,
                        "rowHeight": 2,
                        "categoryName": "Category Question & Answer",
                        "categoryDescription": "Insert Comments box for answers",
                        "CRITERIA": false
                    }
                ]
            }
        ]
    }
]
}
