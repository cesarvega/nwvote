import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
import { ActivatedRoute } from '@angular/router';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';
import { SurveyCreationDesignComponent } from '../survey-creation-design/survey-creation-design.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-survey-matrix',
    templateUrl: './survey-matrix.component.html',
    styleUrls: ['./survey-matrix.component.scss']
})
export class SurveyMatrixComponent extends SurveyCreationDesignComponent implements OnInit {
    @Input() isMenuActive11;
    @Input() bmxClientPageDesignMode;
    @Input() bmxClientPageOverview;
    myAngularxQrCode = 'https://tools.brandinstitute.com/bmxtest/survey/';
    isBrandMatrixSurvey = true

    bmxPagesClient;

    @ViewChild("canvas", { static: true }) canvas: ElementRef;
    username: any;

    projectId
    popUpQRCode = false;
    elem: any;
    isFullscreen: any;
    searchGraveAccentRegExp = new RegExp("`", 'g');
    constructor(@Inject(DOCUMENT) document: any,
        activatedRoute: ActivatedRoute,
        _hotkeysService: HotkeysService,
        dragulaService: DragulaService,
        public _snackBar: MatSnackBar,
        _BmxService: BmxService) {

        super(document, _BmxService, _snackBar, activatedRoute)

        activatedRoute.params.subscribe(params => {
            this.projectId = params['id'];
            this.username = params['username'];
            localStorage.setItem('projectId', this.projectId);
            // this.bsrService.getProjectData(this.projectId).subscribe(arg => {
            //   this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
            //   localStorage.setItem('projectName',  this.projectId);
            // });

        });
    }

    ngOnInit(): void {
        this.bmxClientPageDesignMode = true
        this.myAngularxQrCode = this.myAngularxQrCode + this.projectId + '/' + this.username
        this._snackBar.open('Welcome   ' + this.username.toUpperCase() + '  😉', '', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        })
        this.qrCode.append(this.canvas.nativeElement);
        this.bmxPagesClient = this.SAMPLE_BMX_CLIENT
        this._BmxService.getBrandMatrixByProjectAndUserAnswers(this.projectId, this.username).subscribe((brandMatrix: any) => {
            //    IF USER ALREADY HAVE ANSWERS
            if (brandMatrix.d.length > 0) {
                let answers = JSON.parse(brandMatrix.d.replace(this.searchGraveAccentRegExp, "'"))
                this._BmxService.getBrandMatrixByProject(this.projectId).subscribe((brandMatrix: any) => {
                    let template = JSON.parse(brandMatrix.d.replace(this.searchGraveAccentRegExp, "'"))

                    //  let merge = {...template, ...answers}

                    template.forEach(page => {
                        page.page.forEach((component) => {
                            if (
                                component.componentType == 'rate-scale' ||
                                component.componentType == 'ranking-scale' ||
                                component.componentType == 'image-rate-scale' ||
                                component.componentType == 'narrow-down' ||
                                component.componentType == 'question-answer'
                            ) {
                                component.componentText.forEach((row, index) => {
                                    if (index > 0) {
                                        this.matchMatrix(row, answers, component);
                                    }
                                });
                            }
                        });
                    });


                    this.bmxPagesClient = template
                    //  this.bmxPagesClient = answers
                })
            }
            else {
                // BMX TEMPLATE LOADER BY PROJECT
                this._BmxService.getBrandMatrixByProject(this.projectId).subscribe((brandMatrix: any) => {
                    if (brandMatrix.d.length > 0) {
                        this.bmxPagesClient = JSON.parse(brandMatrix.d.replace(this.searchGraveAccentRegExp, "'"))
                        // this._snackBar.open('bmx LOADED for project  ' + this.projectId , 'OK', {
                        //     duration: 5000,
                        //     horizontalPosition: 'right',
                        //     verticalPosition: 'top'
                        //   })
                    } else {
                        this.bmxPages = this.SAMPLE_BMX_CLIENT
                    }
                })
            }
        })
    }

    matchMatrix(templateRow, answers, templateComponent) {

        console.log('%cTemplateRow', 'color:orange');
        console.log(templateRow);
// 💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜
        answers.forEach(page => {
            page.page.forEach(answerComponent => {
                if (
                    answerComponent.componentType == 'rate-scale' ||
                    answerComponent.componentType == 'image-rate-scale' 
                ) {
                    answerComponent.componentText.forEach((answerRow, index) => {


                        if (!templateComponent.componentSettings[0].CRITERIA) {// no criteria
                            // if (templateComponent.componentType == 'ranking-scale') {
                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                          
                                            templateRow.RATE = answerRow.RATE
                                            templateRow.STARS.forEach(starRow => {
                                                if (starRow.id <= answerRow.RATE) {
                                                    starRow.styleClass = 'active-rating-star'
                                                }
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Comments')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                } else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if(templateComponent.componentSettings[0].CRITERIA) {// with criteria

                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                            templateRow.CRITERIA.forEach((criteria, criteriaIndex) => {
                                                criteria.RATE =  answerRow.CRITERIA[criteriaIndex].RATE
                                                criteria.STARS.forEach((starRow) => {
                                                    if (starRow.id <= answerRow.CRITERIA[criteriaIndex].RATE) {
                                                        starRow.styleClass = 'active-rating-star'
                                                    }
                                                    
                                                });
                                                
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Comments')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                }else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }




                    });
                }

 // ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️

                else if ( answerComponent.componentType == 'ranking-scale' ) {
                    
                    answerComponent.componentText.forEach((answerRow, index) => {


                        if (!templateComponent.componentSettings[0].CRITERIA) {// no criteria
                            // if (templateComponent.componentType == 'ranking-scale') {
                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                          
                                            templateRow.RATE = answerRow.RATE
                                            templateRow.STARS.forEach(starRow => {
                                                if (starRow.id <= answerRow.RATE) {
                                                    starRow.styleClass = 'active-rating-star'
                                                }
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Comments')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                } else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if(templateComponent.componentSettings[0].CRITERIA) {// with criteria

                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                            templateRow.CRITERIA.forEach((criteria, criteriaIndex) => {
                                                criteria.RATE =  answerRow.CRITERIA[criteriaIndex].RATE
                                                criteria.STARS.forEach((starRow) => {
                                                    if (starRow.id <= answerRow.CRITERIA[criteriaIndex].RATE) {
                                                        starRow.styleClass = 'active-rating-star'
                                                    }
                                                    
                                                });
                                                
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Comments')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                }else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    });

                } 




// 💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚
                else if (answerComponent.componentType == 'narrow-down') {
                    answerComponent.componentText.forEach((answerRow, index) => {


                        if (!templateComponent.componentSettings[0].CRITERIA) {// no criteria
                            // if (templateComponent.componentType == 'ranking-scale') {
                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                          
                                            templateRow.RATE = answerRow.RATE
                                            templateRow.STARS.forEach(starRow => {
                                                if (starRow.id <= answerRow.RATE) {
                                                    starRow.styleClass = 'active-rating-star'
                                                }
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Comments')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                } else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if(templateComponent.componentSettings[0].CRITERIA) {// with criteria

                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                            templateRow.CRITERIA.forEach((criteria, criteriaIndex) => {
                                                criteria.RATE =  answerRow.CRITERIA[criteriaIndex].RATE
                                                criteria.STARS.forEach((starRow) => {
                                                    if (starRow.id <= answerRow.CRITERIA[criteriaIndex].RATE) {
                                                        starRow.styleClass = 'active-rating-star'
                                                    }
                                                    
                                                });
                                                
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Comments')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                }else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    });
                } 




 // 💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛


                else if ( answerComponent.componentType == 'question-answer') {
                    answerComponent.componentText.forEach((answerRow, index) => {


                        if (!templateComponent.componentSettings[0].CRITERIA) {// no criteria
                            // if (templateComponent.componentType == 'ranking-scale') {
                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                          
                                            templateRow.RATE = answerRow.RATE
                                            templateRow.STARS.forEach(starRow => {
                                                if (starRow.id <= answerRow.RATE) {
                                                    starRow.styleClass = 'active-rating-star'
                                                }
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Answer')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                } else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if(templateComponent.componentSettings[0].CRITERIA) {// with criteria

                            if (templateComponent.componentType == answerComponent.componentType) {
                                console.log('%cAnswersRow', 'color:blue');
                                console.log(answerRow);
                                if (index > 0) {
                                    for (const key in templateRow) {
                                        if (key === 'nameCandidates' && templateRow[key] === answerRow[key]) {
                                            templateRow.CRITERIA.forEach((criteria, criteriaIndex) => {
                                                criteria.RATE =  answerRow.CRITERIA[criteriaIndex].RATE
                                                criteria.STARS.forEach((starRow) => {
                                                    if (starRow.id <= answerRow.CRITERIA[criteriaIndex].RATE) {
                                                        starRow.styleClass = 'active-rating-star'
                                                    }
                                                    
                                                });
                                                
                                            });
                                            for (const key in templateRow) {
                                                if (key.includes('Comments')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                        answerComponent.componentText.splice(index, 1)
                                                    }
                                                   
                                                } else if (key.includes('RadioColumn')) {
                                                    if (index > 0) {
                                                        templateRow[key] = answerRow[key]
                                                    }
                                                }else if(key == 'SELECTED_ROW'){
                                                    templateRow[key] = answerRow[key]
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    });
                } 


            });
        });

    }

    changePage(direction) {
        if (direction === 'next' && this.bmxPages.length - 1 > this.currentPage) {
            this.currentPage = this.currentPage + 1;
        } else if (direction === 'previous' && this.currentPage >= 1) {
            this.currentPage = this.currentPage - 1;
        }

    }

    selectPageNumber(pageNumber) {
        this.saveUserAnswers()
        if (this.currentPage < pageNumber) {
            this.bmxPagesClient[this.currentPage].page
                .forEach(component => {
                    if (component.componentType == 'rate-scale' ||
                        component.componentType == 'ranking-scale' ||
                        component.componentType == 'image-rate-scale' ||
                        component.componentType == 'narrow-down' ||
                        component.componentType == 'question-answer') {
                        if (component.componentSettings[0].minRule == 0 || component.componentSettings[0].categoryRulesPassed) {
                            this.currentPage = pageNumber;
                            window.scroll(0, 0)
                        } else {
                            this._snackBar.open('You must rate at least ' + component.componentSettings[0].minRule + ' Test Names', 'OK', {
                                duration: 5000,
                                verticalPosition: 'top',
                            })
                        }
                    }

                });
        } else {
            this.currentPage = pageNumber;
            window.scroll(0, 0)
        }
    }

    saveUserAnswers() {
        this._BmxService.saveOrUpdateAnswers(this.bmxPagesClient, this.projectId, this.username).subscribe((res: any) => {
            console.log('%cANSWERS!', 'color:#007bff', res);
            let page = res.d.replace(this.searchGraveAccentRegExp, "'")
            this._snackBar.open(this.username.toUpperCase() + ' your answers were saved  ', 'OK', {
                duration: 5000,
                verticalPosition: 'top',
            })
        })
    }

    SAMPLE_BMX_CLIENT = [
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                                }
                            ],
                            "nameCandidates": "Name Candidates",
                            "rationale": "Rationales",
                            "Comments1": "General Comments",
                            "RATE": -1
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
                            "nameCandidates": "TEMPORAL  ",
                            "rationale": "Treatment to Slow Parkinson’s Given Orally",
                            "Comments1": "",
                            "RATE": -1
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
                            "nameCandidates": "Moderato  ",
                            "rationale": "A Moderate Musical Tempo (Suggests Slowing Disease Progression)",
                            "Comments1": "",
                            "RATE": -1
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
                            "nameCandidates": "REINSPIRE ",
                            "rationale": "Reviewing an Early Intervention for Slowing Parkinson's Disease Progression - Give Hope, Links to UCB's \"Inspired by Patients\"",
                            "Comments1": "",
                            "RATE": -1
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
                            "nameCandidates": "MILKY WAY  ",
                            "rationale": "MIsfolding Parkinson Study With Early Stage Patients",
                            "Comments1": "",
                            "RATE": -1
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
                            "nameCandidates": "Arkitect ",
                            "rationale": "\"Architect,\" Embeds Ark for Parkinson's Disease and Implies Stability or Planning Ahead",
                            "Comments1": "",
                            "RATE": -1
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
                            "nameCandidates": "Unfolding ",
                            "rationale": "A Slow Revealing, Suggests Slowing Disease Progression and Links to Alpha-Synuclein Misfolding",
                            "Comments1": "",
                            "RATE": -1
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
                            "nameCandidates": "ORCHESTRA  ",
                            "rationale": "ORal New Chemical Entity Aiming to Slow Disease Trajectory in Early Parkinson’s",
                            "Comments1": "",
                            "RATE": -1
                        }
                    ],
                    "componentSettings": [
                        {
                            "minRule": 0,
                            "maxRule": 4,
                            "fontSize": 16,
                            "columnWidth": 191,
                            "rationalewidth": 804,
                            "rowHeight": 2,
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
                            "categoryName": "Name Candidates",
                            "categoryDescription": "With Max Rate Amount",
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Pledge  ",
                            "rationale": "A Promise or Oath, Embeds P and D for Parkinson's Disease",
                            "Comments1": "",
                            "RATE": 1
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Opening  ",
                            "rationale": "Onset, Beginning (i.e., an Early Treatment)",
                            "Comments1": "",
                            "RATE": 6
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "SUSPEND  ",
                            "rationale": "Study of UCB0599's Slowing of the Progression of Early Parkinson's Disease - Delay",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Placid  ",
                            "rationale": "Calm, Steady, Stable, Begins in P and Ends with D to Suggest Parkinson's Disease",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "At Dawn ",
                            "rationale": "Suggests Early Treatment",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Skylark  ",
                            "rationale": "Type of Bird, May Connote Freedom or Taking Flight, Links to Parkinson's Disease",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Pearly  ",
                            "rationale": "Shining Like a Pearl (May Suggest Hope), Implies Treating Parkinson's Disease (P-) Early",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "STEADY  ",
                            "rationale": "Study Testing an Early Parkinson's Disease Therapy - Suggests Stabilizing Symptoms, Gaining Control",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "PositiveDirection ",
                            "rationale": "A Hopeful Step Forward, Uses P and D for Parkinson's Disease",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Moderato  ",
                            "rationale": "A Moderate Musical Tempo (Suggests Slowing Disease Progression)",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "REINSPIRE ",
                            "rationale": "Reviewing an Early Intervention for Slowing Parkinson's Disease Progression - Give Hope, Links to UCB's \"Inspired by Patients\"",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Bloom  ",
                            "rationale": "Symbolic of Tulips and a Brighter Future",
                            "Comments1": ""
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
                                },
                                {
                                    "id": 5,
                                    "icon": 6,
                                    "styleClass": "rating-star"
                                },
                                {
                                    "id": 6,
                                    "icon": 7,
                                    "styleClass": "rating-star"
                                }
                            ],
                            "nameCandidates": "Embark  ",
                            "rationale": "To Set Out on a Journey, May Connote Optimism or Hope, Links to Parkinson's Disease",
                            "Comments1": ""
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
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
                            "radioColumnsWidth": 75,
                            "selectedRanking": 7,
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
                            "selectedRanking": 7,
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                            "RadioColumn5": false,
                            "RATE": 0
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
                            "RadioColumn1": true,
                            "RadioColumn2": false,
                            "RadioColumn3": false,
                            "RadioColumn4": false,
                            "RadioColumn5": false,
                            "RATE": 1
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
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
                            "radioColumnsWidth": 75,
                            "selectedRanking": 7,
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                            "nameCandidates": "Name Candidates",
                            "rationale": "Rationale",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Pledge  ",
                            "rationale": "A Promise or Oath, Embeds P and D for Parkinson's Disease",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Opening  ",
                            "rationale": "Onset, Beginning (i.e., an Early Treatment)",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "SUSPEND  ",
                            "rationale": "Study of UCB0599's Slowing of the Progression of Early Parkinson's Disease - Delay",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Placid  ",
                            "rationale": "Calm, Steady, Stable, Begins in P and Ends with D to Suggest Parkinson's Disease",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "At Dawn ",
                            "rationale": "Suggests Early Treatment",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Skylark  ",
                            "rationale": "Type of Bird, May Connote Freedom or Taking Flight, Links to Parkinson's Disease",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Pearly  ",
                            "rationale": "Shining Like a Pearl (May Suggest Hope), Implies Treating Parkinson's Disease (P-) Early",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "STEADY  ",
                            "rationale": "Study Testing an Early Parkinson's Disease Therapy - Suggests Stabilizing Symptoms, Gaining Control",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "PositiveDirection ",
                            "rationale": "A Hopeful Step Forward, Uses P and D for Parkinson's Disease",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Moderato  ",
                            "rationale": "A Moderate Musical Tempo (Suggests Slowing Disease Progression)",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "REINSPIRE ",
                            "rationale": "Reviewing an Early Intervention for Slowing Parkinson's Disease Progression - Give Hope, Links to UCB's \"Inspired by Patients\"",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Bloom  ",
                            "rationale": "Symbolic of Tulips and a Brighter Future",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
                            "SELECTED_ROW": false
                        },
                        {
                            "nameCandidates": "Embark  ",
                            "rationale": "To Set Out on a Journey, May Connote Optimism or Hope, Links to Parkinson's Disease",
                            "CRITERIA": [
                                {
                                    "name": "Fit to Company Description",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                },
                                {
                                    "name": "Fit to Product Statement",
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
                                        },
                                        {
                                            "id": 8,
                                            "icon": "grade",
                                            "styleClass": "rating-star"
                                        }
                                    ],
                                    "RATE": -1
                                }
                            ],
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
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
                            "categoryName": "Category Narrow Down",
                            "categoryDescription": "This is narrow down matrix",
                            "ratingScaleTitle": "RATING",
                            "ratingScaleNarrowDownTitle": "SELECT 5 OUT OF 10",
                            "CRITERIA": true
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "Comments1": ""
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
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
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
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
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
                            "categoryRulesPassed": false,
                            "ratedCounter": 0,
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
