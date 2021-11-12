import {
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { BmxService } from '../bmx.service';
import { DOCUMENT } from '@angular/common';
import QRCodeStyling from 'qr-code-styling';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-project-reports',
    templateUrl: './project-reports.component.html',
    styleUrls: ['./project-reports.component.scss'],
})
export class ProjectReportsComponent
    implements OnInit {
    @Input() isMenuActive16: boolean = true;
    @Input() bmxClientPageDesignMode = false;
    @Input() bmxClientPageOverview = false;
    isMobile = true
    @Input() isBrandMatrixSurvey
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    bmxPagesClient;
    myAngularxQrCode = 'https://tools.brandinstitute.com/bmxtest/survey/';
    popUpQRCode = false;
    elem: any;
    isFullscreen: any;
    TEMPLATE_NAME = 'Standart Personal Preference';

    model = {
        editorData: '',
        namesData: '',
    };
    TestNameDataModel: any;
    ckconfig: any;
    selectedIndex: any;
    sampleHtml = `<p style="text-align:center;color:red">Instructions</p>\n\n<p style=\"text-align:justify\"><br />\nPlease select at least three &quot;themes&quot; you would consider to move forward for the Line Draw Family.</p>\n\n<p style=\"text-align:justify\"><strong>What do we mean by &quot;theme&quot;:</strong></p>\n\n<p style=\"text-align:justify\">We will develop names that pertain to an overarching theme. Each individual name candidate will have potential to be used as an ingredient brand to be used across all Line Draw Family concepts or as it pertains to each individual concept. In the latter scenario, we will develop names with a common word part and this word part will be included in each concept name. For example, if you choose the &quot;Optimized&quot; theme, we will develop candidates around the Op/Opt/Opti word parts.</p>\n\n<p style=\"text-align:justify\"><strong>How many themes should I vote on?</strong></p>\n\n<p style=\"text-align:justify\">You can select as many as you&rsquo;d like but we request that you select at least 3 themes. Based on the vote, we will select three to five themes for full creative exploration. How do I provide a vote? To make a selection, simply click the checkbox to the left of the desired name candidate. After you make a selection, you will be asked to rate that theme based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.</p>\n\n<p style=\"text-align:justify\">Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n`;
    sampleHtml2 = `<p style="text-align:center;color:#324395;font-weight: 500;font-size: 25px;">USE THE EDITOR TO EDIT THIS TEXT</p>`;
    selectedOption: any;
    rankingScaleValue = 5;

    displayInstructions = false;

    selectedStarRatingIndex = '';
    selectedRating = 0;
    newTestNames = [];
    ratingScale = 5;

    // TEMPLATE BOX
    isTemplateBoxOn = false;
    isSaveOrUpdate = false;
    isOverViewPageOn = false;
    templateTitle;
    TEMPLATES = [
        { TemplateName: 'Standart Personal Preference' },
        { TemplateName: 'Ranking' },
        { TemplateName: 'NarrowDown' },
        { TemplateName: 'This or That' },
        { TemplateName: 'Naming Contest' },
        { TemplateName: 'Question & Answer' },
    ];
    templateName = '';
    selectedTemplateName = '';

    bmxCompleteObject = {
        userInfo: {},
        projectInfo: '',
        bmx: '',
        // tables: []
    };
    // SURVEY CREATOR VARIABLES & SCHEME

    currentPage = 0;

    brandMatrixObjects = [
        {
            componentType: 'logo-header',
            componentText: 'PROJECT NAME',
            componentSettings: [
                { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
            ],
        },
        {
            componentType: 'instructions',
            componentText: this.sampleHtml,
            componentSettings: [
                { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
            ],
        },
    ];

    bmxPages: any = [
        {
            pageNumber: 1,
            page: this.brandMatrixObjects,
        },
    ];

    projectInfo: string;
    qrCode: QRCodeStyling;
    projectId: any;
    biUsername: string;
    biUserId = 'user@bi.com';
    rowCalculator = [];

    REPORT_DATA = []
    REPORT_DATA_MAP = new Map()
    REPORT_CATEGORIES = []
    BMX_REPORT = []
    categoryCounter = 0
    categorySortedgArray = []
    constructor(
        @Inject(DOCUMENT) private document: any,
        public _BmxService: BmxService,
        public _snackBar: MatSnackBar,
        activatedRoute: ActivatedRoute
    ) {
        let qrCodeColotThemes = {
            dotsOptions: {
                type: 'dots',
                color: '#9d64a1',
                gradient: {
                    type: 'linear',
                    rotation: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#9d64a1',
                        },
                        {
                            offset: 3,
                            color: '#decddf',
                        },
                    ],
                },
            },
            backgroundOptions: {
                type: 'square',
                color: '#fff',
                gradient: {
                    type: 'radial',
                    rotation: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#fff',
                        },
                    ],
                },
            },
            cornersDotOptions: {
                type: 'dot',
                color: '#fff',
                gradient: {
                    type: 'linear',
                    rotation: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#fff',
                        },
                        {
                            offset: 3,
                            color: '#fff',
                        },
                    ],
                },
            },
        };
        this.qrCode = new QRCodeStyling({
            width: 223,
            height: 223,
            data: this.myAngularxQrCode,
            margin: 0,
            qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
            imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
            dotsOptions: {
                type: 'dots',
                color: '#1023da',
                gradient: {
                    type: 'linear',
                    rotation: 45,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#1023da',
                        },
                        {
                            offset: 3,
                            color: '#8831da',
                        },
                    ],
                },
            },
            backgroundOptions: { color: '#fff' },
            image: './assets/img/bmx/bmxCube.jpg',
            cornersSquareOptions: {
                type: 'square',
                color: '#000',
                gradient: {
                    type: 'radial',
                    rotation: 45,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#000',
                        },
                    ],
                },
            },
            cornersDotOptions: {
                type: 'dot',
                color: '#000',
                gradient: {
                    type: 'linear',
                    rotation: 45,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#000',
                        },
                        {
                            offset: 3,
                            color: '#000',
                        },
                    ],
                },
            },
        });

        activatedRoute.params.subscribe(params => {
            this.projectId = params['id'];
            this.biUsername = params['biUsername'];
            localStorage.setItem('projectId', this.projectId);
            // this.bsrService.getProjectData(this.projectId).subscribe(arg => {
            //   this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
            //   localStorage.setItem('projectName',  this.project Id);
            // });
        });
    }

    ngOnInit(): void {
        this.myAngularxQrCode = this.myAngularxQrCode + this.projectId + '/' + this.biUsername

        // SAMPLE DATA FOR CKEDITOR
        // this.model.editorData = this.sampleHtml;
        // // TEMPLATE SELECTOR
        // if (this.TEMPLATE_NAME === 'Standart Personal Preference') {
        //     this.createNewBmxComponent('rate-scale');
        // }
        // if (this.bmxPagesClient) {
        //     // this.bmxPages = this.bmxPagesClient;
        // } else {
            //   this.bmxPages = this.SAMPLE_BMX;

            // this._BmxService.getBrandMatrixByProject(this.projectId).subscribe((brandMatrix: any) => {
            //     if (brandMatrix.d.length > 0) {
            //         this.bmxPages = JSON.parse(brandMatrix.d)

            //         // this._snackBar.open('bmx LOADED for project  ' + this.projectId , 'OK', {
            //         //     duration: 5000,
            //         //     horizontalPosition: 'left',
            //         //     verticalPosition: 'top'
            //         //   })
            //     } else {
            //         this.bmxPages = this.SAMPLE_BMX
            //     }

            // })

        // }

        this._BmxService.getBrandMatrixByProjectAllUserAnswers(this.projectId).subscribe((brandMatrix: any) => {
            if (brandMatrix.d.length > 0) {
                const answersByAllUsers = JSON.parse(brandMatrix.d)
                const milUsers = this.diplicateArrayMultiple(answersByAllUsers, 1)
                milUsers.forEach((userAnswer, userAnswerIndex) => {
                    this.categoryCounter = 0
                    let userCategory = []
                    JSON.parse(userAnswer.BrandMatrix).forEach(page => {
                        page.page.forEach(component => {
                            if (
                                component.componentType == 'rate-scale' ||
                                component.componentType == 'ranking-scale' ||
                                component.componentType == 'image-rate-scale' ||
                                component.componentType == 'narrow-down' ||
                                component.componentType == 'tinder' ||
                                component.componentType == 'question-answer'
                            ) {
                                this.categoryCounter++
                                if (userAnswerIndex == 0) {
                                    let categoryObj = new Object();
                                    categoryObj['category_' + this.categoryCounter] = []
                                    this.BMX_REPORT.push(categoryObj)
                                }
                                component.componentText.forEach((row, rowIndex) => {
                                    if (rowIndex > 0) {
                                        this.computeReport(row, component, userAnswer.Username,
                                            this.BMX_REPORT[this.categoryCounter - 1]['category_' + this.categoryCounter]);
                                    }
                                });
                                let categroyName = 'category_' + this.categoryCounter
                                let objectContainer = {}
                                objectContainer[categroyName] = component.componentText
                                userCategory.push(objectContainer)
                                this.REPORT_DATA_MAP.set(userAnswer.Username, userCategory);
                            }
                        });
                    });
                });

                let sortIngArray = []

                this.BMX_REPORT.forEach((category, categoryIndex) => {
                    const sortedCategory = Object.keys(category)[0]
                    Object.keys(category[sortedCategory]).forEach((key, keyIndex) => {
                        this.BMX_REPORT[categoryIndex][sortedCategory][key].totalScore
                        sortIngArray.push({
                            nameCandidates: key,
                            score: this.BMX_REPORT[categoryIndex][sortedCategory][key].totalScore,
                            comments: this.BMX_REPORT[categoryIndex][sortedCategory][key].comments
                        })
                    });
                    this.categorySortedgArray.push(this.sortArrayByTwoProperties(sortIngArray, 'score', 'nameCandidates'))
                    sortIngArray = []
                });


                this.bmxPages = [
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
                                        "nameCandidates": "Name Candidates",
                                        "rationale": "Rationales",
                                        "Comments1": "General Comments",
                                        "RATE": -1
                                    },

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
                    }]

                console.log(this.bmxPages[this.currentPage].page);

                let component
                let categoryArray =[]
                console.log(this.BMX_REPORT);
                console.log(this.categorySortedgArray);
                // FIXING ARRAY TO BE DEPLAY ON THE PAGE
                this.categorySortedgArray.forEach((category, categoryIndex) => {
                    // if (categoryIndex == 0) {

                        component = {
                            "componentType": "rate-scale",
                            "componentText": [
                            ],
                            "componentSettings": [
                                {
                                    "minRule": 0,
                                    "maxRule": 4,
                                    "fontSize": 16,
                                    "columnWidth": 325,
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
                        let comments
                        category.forEach((row, rowIndex) => {
                            if (rowIndex == 0) {
                               const rowObj = {}
                               Object.keys(row).forEach((key, keyIndex) => {
                                rowObj[key] = key
                                 
                               })
                               component.componentText.push(rowObj) 
                            }
                            else {
                                component.componentText.push(row)
                                row.comments.forEach((comment, index, commnetsArray) => {
                                    if (comment) {
                                       
                                        comments = `<div style="color: blueviolet;">` + comment.userName + `: ` +
                                                  `<span style="color: brown;">`+ comment.comment + `</span>`   + `</div>`
                                        commnetsArray[index] = comments + `\n`
                                    }
                                });
                                component.componentText[rowIndex].comments = row.comments.join('').toString()
                            }
                           
                        });
                    // }
                    this.bmxPages[0].page.push(component)
                });

                // this.bmxPages[0].page[2] = component
                // this.bmxPages[0].page.push(categoryArray)
            }
        })
    }


    computeReport(row, templateComponent, username, REPORT_DATA) {
        // 💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜
        if (templateComponent.componentType == 'rate-scale' || templateComponent.componentType == 'image-rate-scale' ||
            templateComponent.componentType == 'ranking-scale') {
            if (templateComponent.componentSettings[0].CRITERIA) {
                if (REPORT_DATA[row.nameCandidates]) {
                    REPORT_DATA[row.nameCandidates].scores.forEach((Score, scoreIndex) => {
                        Score.score += row.CRITERIA[scoreIndex].RATE
                        REPORT_DATA[row.nameCandidates].totalScore += Score.score
                    });
                    if (row.Comments1?.length > 0) {
                        REPORT_DATA[row.nameCandidates].comments.push({ userName: username, comment: row.Comments1 })
                    }
                } else {
                    let rateArray = []
                    let totalScore = 0
                    row.CRITERIA.forEach(criteria => {
                        rateArray.push({ name: criteria.name, score: (criteria.RATE > 0) ? criteria.RATE : 0 })
                        totalScore += (criteria.RATE > 0) ? criteria.RATE : 0
                    })
                    let comment = (row.Comments1?.length > 0) ? { userName: username, comment: row.Comments1 } : undefined
                    REPORT_DATA[row.nameCandidates] = {
                        category: templateComponent.componentType,
                        testName: row.nameCandidates,
                        rationale: row.rationale,
                        comments: [comment],
                        scores: rateArray,
                        totalScore: totalScore
                    }
                }// 💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜
            } else {
                if (REPORT_DATA[row.nameCandidates]) {
                    if (row.RATE > 0) {
                        REPORT_DATA[row.nameCandidates].scores.push(row.RATE)
                        REPORT_DATA[row.nameCandidates].totalScore += row.RATE
                        // REPORT_DATA[row.nameCandidates].row.push(row)
                    }
                    if (row.Comments1?.length > 0) {
                        REPORT_DATA[row.nameCandidates].comments.push({ userName: username, comment: row.Comments1 })
                    }
                } else {
                    let comment = (row.Comments1?.length > 0) ? { userName: username, comment: row.Comments1 } : undefined
                    REPORT_DATA[row.nameCandidates] = {
                        category: templateComponent.componentType,
                        // row: [row],
                        // user: username,
                        testName: row.nameCandidates,
                        rationale: row.rationale,
                        comments: [comment],
                        scores: [(row.RATE > 0) ? row.RATE : 0],
                        totalScore: (row.RATE > 0) ? row.RATE : 0
                    }
                }
            }

            // console.count('rows')
            //    console.timeLog()
        }

        // ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️

        // else if (templateComponent.componentType == 'ranking-scale') {
        //     if (REPORT_DATA[row.nameCandidates]) {
        //         if (row.RATE > 0) {
        //             REPORT_DATA[row.nameCandidates].scores.push(row.RATE)
        //             REPORT_DATA[row.nameCandidates].totalScore += row.RATE
        //         }
        //         if (row.Comments1?.length > 0) {
        //             REPORT_DATA[row.nameCandidates].comments.push({ userName: username, comment: row.Comments1 })
        //         }
        //     } else {
        //         let comment = (row.Comments1?.length > 0) ? { userName: username, comment: row.Comments1 } : undefined
        //         REPORT_DATA[row.nameCandidates] = {
        //             category: templateComponent.componentType,
        //             testName: row.nameCandidates,
        //             rationale: row.rationale,
        //             comments: [comment],
        //             scores: [(row.RATE > 0) ? row.RATE : 0],
        //             totalScore: (row.RATE > 0) ? row.RATE : 0
        //         }
        //     }
        // }

        // 💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚
        else if (templateComponent.componentType == 'narrow-down') {
            if (REPORT_DATA[row.nameCandidates]) {
                if (row.RATE > 0) {
                    REPORT_DATA[row.nameCandidates].scores.push(row.RATE)
                    REPORT_DATA[row.nameCandidates].totalScore += row.RATE
                }
                if (row.Comments1?.length > 0) {
                    REPORT_DATA[row.nameCandidates].comments.push({ userName: username, comment: row.Comments1 })
                }
            } else {
                let comment = (row.Comments1?.length > 0) ? { userName: username, comment: row.Comments1 } : undefined
                REPORT_DATA[row.nameCandidates] = {
                    category: templateComponent.componentType,
                    testName: row.nameCandidates,
                    rationale: row.rationale,
                    comments: [comment],
                    scores: [(row.RATE > 0) ? row.RATE : 0],
                    totalScore: (row.RATE > 0) ? row.RATE : 0
                }
            }
        }
        // 💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛

        else if (templateComponent.componentType == 'question-answer') {

        }
        //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

        else if (templateComponent.componentType == 'tinder') {

            this.rowCalculator['test name'] = row.nameCandidates
            this.rowCalculator['positiveRank'] += (row.vote == 'positive') ? 1 : ''
            this.rowCalculator['negatvieRank'] += (row.vote == 'negative') ? 1 : ''
        }
    }


    toggleInstructions() {
        this.displayInstructions = !this.displayInstructions;
    }

    checkDragEvetn(e) {
        console.log(e);
    }

    deletePage() {
        if (this.currentPage > 0) {

            this.bmxPages.splice(this.currentPage, 1)

            this.bmxPages.forEach((page, index) => {
                page.pageNumber = index + 1
            });
            this.currentPage--
        }
    }
    createPage() {
        this.bmxPages.push({
            pageNumber: this.bmxPages.length + 1,
            page: [
                {
                    componentType: '',
                    componentText: '',
                    componentSettings: [
                        { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
                    ],
                },
            ],
        });
    }

    createNewBmxComponent(componentType) {
        // ☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️
        if (componentType === 'logo-header') {
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: 'PROJECT NAME',
                componentSettings: [
                    {
                        fontSize: '16px',
                        fontFace: 'Arial',
                        logoWidth: 100,
                        brandInstituteLogoURL: './assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg',
                        brandInstituteSurveyLogoURL: './assets/img/bmx/bm-logo-2020-high.png',
                        brandInstituteMobileURL: './assets/img/bmx/bmxCube.jpg',
                        companyLogoURL: './assets/img/bmx/BD.png',
                    },
                ],
            });
        } // ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
        else if (componentType === 'text-editor') {
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: this.sampleHtml2,
                componentSettings: [
                    { fontSize: '16px', fontFace: 'Arial', fontColor: 'red' },
                ],
            }); // 💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛
        } else if (componentType === 'rate-scale') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                name: 'NAME',
                rationale: 'RATIONALE',
                STARS: this.createRatingStars(),
            });
            for (let index = 0; index < 5; index++) {
                this.TestNameDataModel.push({
                    name: 'TEST NAME ' + index,
                    rationale: 'Rationale of an undisclosed length',
                    RATE: -1,
                    STARS: this.createRatingStars(),
                });
            }
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: this.TestNameDataModel,
                componentSettings: [
                    {
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 150,
                        rationalewidth: 250,
                        rowHeight: 2,
                        radioColumnsWidth: 75,
                        CRITERIA: false,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category Rate',
                        categoryDescription: 'This is Rate matrix',
                        ratingScaleTitle: 'RATING',
                    },
                ],
            });
        } // 💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚
        else if (componentType === 'ranking-scale') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                name: 'NAME',
                rationale: 'RATIONALE',
                STARS: this.createRankinScale(),
            });
            for (let index = 0; index < 3; index++) {
                this.TestNameDataModel.push({
                    name: 'TEST NAME ' + index,
                    rationale: 'Rationale of an undisclosed length',
                    RATE: -1, // it wont render since is not a string
                    STARS: this.createRankinScale(),
                });
            }
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: this.TestNameDataModel,
                componentSettings: [
                    {
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 150,
                        rationalewidth: 250,
                        rowHeight: 2,
                        radioColumnsWidth: 75,
                        selectedRanking: 7,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category Ranking',
                        categoryDescription: 'This is Ranking matrix',
                        ratingScaleTitle: 'RANK',
                        rankType: 'dropDown',
                    },
                ],
            });
        } // ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
        else if (componentType === 'image-rate-scale') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                // name: '',
                name: 'LOGO',
                // logoURL:''
                // STARS: this.createRatingStars()
            });
            for (let index = 0; index < 5; index++) {
                let imageIndex = index + 1;
                this.TestNameDataModel.push({
                    // name: 'TEST NAME ' + index,
                    name:
                        './assets/img/bmx/logoTestNames/logo' +
                        imageIndex.toString() +
                        '.JPG',
                    // logoURL: './assets/img/bmx/logoTestNames/logo' + imageIndex.toString() + '.JPG',
                    RATE: -1,
                    STARS: this.createRatingStars(),
                });
            }
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: this.TestNameDataModel,
                componentSettings: [
                    {
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 336,
                        rationalewidth: 250,
                        rowHeight: 2,
                        CRITERIA: false,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category Logo Rating',
                        categoryDescription: 'This is logo rating matrix',
                        ratingScaleTitle: 'Personal Preference',
                    },
                ],
            });
        } // 💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜
        else if (componentType === 'narrow-down') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                name: 'NAME',
                rationale: 'RATIONALE',
                // STARS: this.createRatingStars()
            });
            for (let index = 0; index < 5; index++) {
                this.TestNameDataModel.push({
                    name: 'TEST NAME ' + index,
                    rationale: 'Rationale of an undisclosed length',
                    RATE: -1,
                    STARS: this.createRatingStars(),
                });
            }
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: this.TestNameDataModel,
                componentSettings: [
                    {
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 150,
                        rationalewidth: 250,
                        rowHeight: 2,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category Narrow Down',
                        categoryDescription: 'This is a narrow down matrix',
                        ratingScaleTitle: 'RATE',
                    },
                ],
            });
        } // 🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍
        else if (componentType === 'question-answer') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                name: 'Questions',
                // rationale: 'RATIONALE',
                STARS: this.createRatingStars(),
            });
            for (let index = 0; index < 5; index++) {
                this.TestNameDataModel.push({
                    name: 'QUESTION ' + index,
                    // rationale: 'Rationale of an undisclosed length',
                    RATE: -1,
                    STARS: this.createRatingStars(),
                });
            }
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: this.TestNameDataModel,
                componentSettings: [
                    {
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 600,
                        rationalewidth: 250,
                        rowHeight: 2,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category Question & Answer',
                        categoryDescription: 'Insert Comments box for answers',
                        // "ratingScaleTitle": "RATING"
                    },
                ],
            });
        }// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        else if (componentType === 'tinder') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                name: 'Questions',
                // rationale: 'RATIONALE',
                STARS: this.createRatingStars(),
            });
            for (let index = 0; index < 5; index++) {
                this.TestNameDataModel.push({
                    name: 'QUESTION ' + index,
                    // rationale: 'Rationale of an undisclosed length',
                    RATE: -1,
                    STARS: this.createRatingStars(),
                });
            }
            this.bmxPages[this.currentPage].page.push({
                componentType: componentType,
                componentText: this.TestNameDataModel,
                componentSettings: [
                    {
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 600,
                        rationalewidth: 250,
                        rowHeight: 2,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Tinder Category 🔥',
                        categoryDescription: 'Swipe Left or right',
                        // "ratingScaleTitle": "RATING"
                    },
                ],
            });
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
        if (this.currentPage < pageNumber) {
            this.bmxPages[this.currentPage].page.forEach((component) => {
                if (
                    component.componentType == 'rate-scale' ||
                    component.componentType == 'ranking-scale' ||
                    component.componentType == 'image-rate-scale' ||
                    component.componentType == 'narrow-down' ||
                    component.componentType == 'question-answer'
                ) {
                    if (
                        component.componentSettings[0].minRule == 0 ||
                        component.componentSettings[0].categoryRulesPassed
                    ) {
                        this.currentPage = pageNumber;
                    } else {
                        this._snackBar.open(
                            'You must rate at least ' +
                            component.componentSettings[0].minRule +
                            ' Test Names',
                            'OK',
                            {
                                duration: 5000,
                                horizontalPosition: 'right',
                                verticalPosition: 'top',
                            }
                        );
                    }
                } else {
                    this.currentPage = pageNumber;
                }
            });
        } else {
            this.currentPage = pageNumber;
            // window.scroll(0, 0)
        }
    }

    deleteComponent(i) {
        this.bmxPages[this.currentPage].page.splice(i, 1);
    }

    // TEMPLATE METHODS
    saveOrUpdateTemplate(templateName) {
        localStorage.setItem(templateName, JSON.stringify(this.bmxPages));

        this._BmxService.saveBrandMatrixTemplate(templateName, this.bmxPages, this.biUserId).subscribe((template: any) => {
            this.templateTitle = "Template '" + templateName + "' saved 🧐";
            this._snackBar.open(this.templateTitle, 'OK', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            })
        })

        if (this.TEMPLATES.indexOf(templateName) < 0) {
            this.TEMPLATES.push(templateName);
        }

        setTimeout(() => {
            this.openSaveTemplateBox();
        }, 1000);
    }

    loadTemplate(templateName) {
        // if (localStorage.getItem(templateName)) {
        //   this.bmxPages = JSON.parse(localStorage.getItem(templateName));
        // }
        this._BmxService.getBrandMatrixTemplateByName(templateName).subscribe((template: any) => {
            this.bmxPages = JSON.parse(template.d);
            this._snackBar.open('template ' + "'" + templateName + "'" + ' loaded 😀', 'OK', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            })
        })
        this.openSaveTemplateBox();
    }

    deleteTemplate(templateName) {
        // if (localStorage.getItem(templateName)) {
        //   this.bmxPages = JSON.parse(localStorage.getItem(templateName));
        // }
        this._BmxService.deleteBrandMatrixTemplateByName(templateName, this.biUserId).subscribe((template: any) => {
            this._snackBar.open('template ' + "'" + templateName + "'" + ' deleted 😳', 'OK', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            })
        })


        this.openSaveTemplateBox();
    }


    templateSelected() {
        this.isSaveOrUpdate = true;
    }

    delete() {
        this.isTemplateBoxOn = true;
    }

    openSaveTemplateBox() {
        this.templateName = '';
        this.templateTitle = 'save, update or load a template';
        this.isTemplateBoxOn = !this.isTemplateBoxOn;
    }

    resetTemplate() {
        this.bmxPages = [
            {
                pageNumber: 1,
                page: [
                    {
                        componentType: 'logo-header',
                        componentText: 'PROJECT NAME',
                        componentSettings: [
                            {
                                fontSize: '16px',
                                fontFace: 'Arial',
                                logoWidth: 100,
                                brandInstituteURL: './assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg',
                                brandInstituteMobileURL: './assets/img/bmx/bmxCube.jpg',
                                companyLogoURL: './assets/img/bmx/BD.png',
                            },
                        ],
                    },
                ],
            },
        ];
    }

    saveData() {
        this.projectInfo = JSON.parse(
            localStorage.getItem('fakeproject' + '_project_info')
        );
        this.bmxCompleteObject = {
            userInfo: { username: 'John Smith' },
            projectInfo: this.projectInfo,
            bmx: this.bmxPages,
            // tables: []
        };
        this.bmxPages.forEach((pageElement) => {
            pageElement.page.forEach((component) => {
                if (
                    component.componentType == 'rate-scale' ||
                    component.componentType == 'ranking-scale' ||
                    component.componentType == 'image-rate-scale' ||
                    component.componentType == 'narrow-down' ||
                    component.componentType == 'question-answer'
                ) {
                    this.calculateTableDefinitions(component);
                }
            });
        });
        // console.log(this.bmxCompleteObject.bmx[4]["page"][3]['componentText']);
        this._BmxService
            .saveOrUpdateBradnMatrixTemplate(this.bmxPages, this.projectId)
            .subscribe((res) => {
                console.log('%cBMX!', 'color:orange', res);
                this._snackBar.open('Project ' + this.projectId + ' saved', 'OK', {
                    duration: 5000,
                    verticalPosition: 'top',
                })
            });
    }

    // 🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭PRIVATE METHODS 🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭🌭

    createRatingStars() {
        let startCounter: any = [];
        for (let index = 1; index <= this.ratingScale; index++) {
            startCounter.push({
                id: index,
                icon: 'grade',
                styleClass: 'rating-star',
            });
        }
        return startCounter;
    }

    createRankinScale() {
        let startCounter: any = [];
        for (let index = 1; index <= 3; index++) {
            startCounter.push({
                id: index,
                icon: index,
                styleClass: 'rating-star',
            });
        }
        return startCounter;
    }

    calculateTableDefinitions(component) {
        let table = {
            tableType: component.componentType,
            tableRows: [],
        };
        component.componentText.forEach((element, rowIndex) => {
            let columnNames = Object.keys(element);

            let tableR = { rowRate: {}, columnDefinition: [] };

            tableR['rowRate'] =
                rowIndex == 0
                    ? 'header'
                    : element['RATE']
                        ? element['RATE']
                        : 'not rated';

            if (
                component.componentSettings[0].rankType == 'dragAndDrop' &&
                rowIndex != 0
            ) {
                tableR['rowRate'] = rowIndex;
            }
            if (component.componentType == 'question-answer') {
                tableR['rowRate'] = 'Q & A';
            }
            let tableL = { rowRate: [], columnDefinition: [] };
            if (component.componentSettings[0].CRITERIA) {
                element['CRITERIA'].forEach((Criteria) => {
                    if (rowIndex == 0) {
                        tableL['rowRate'].push({ rate: 'header', criteria: Criteria.name });
                    } else {
                        tableL['rowRate'].push({
                            rate: Criteria.RATE == -1 ? 'not-rated' : Criteria.RATE,
                            criteria: Criteria.name,
                        });
                    }
                });
                tableR['rowRate'] = tableL['rowRate'];
            }

            columnNames.forEach((columnName, order) => {
                if (
                    columnName != 'STARS' &&
                    columnName != 'CRITERIA' &&
                    columnName != 'RATE'
                ) {
                    element[columnName];
                    tableR['columnDefinition'].push({
                        // componentType: component.componentType,
                        columnName: columnName,
                        columnDisplayName: element[columnName],
                        ColumnOrder: order,
                        // rate:(element['RATE'])?element['RATE']:'header'
                    });
                }
            });
            table.tableRows.push(tableR);
        });

        // this.bmxCompleteObject['tables'].push(table)
    }

    displayQrCode() {
        this.popUpQRCode = !this.popUpQRCode;
    }

    openFullscreen() {
        this.elem = document.documentElement;
        this.isFullscreen = !this.isFullscreen;
        if (this.isFullscreen) {
            if (this.elem.requestFullscreen) {
                this.elem.requestFullscreen();
            } else if (this.elem.mozRequestFullScreen) {
                /* Firefox */
                this.elem.mozRequestFullScreen();
            } else if (this.elem.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                this.elem.webkitRequestFullscreen();
            } else if (this.elem.msRequestFullscreen) {
                /* IE/Edge */
                this.elem.msRequestFullscreen();
            }
        } else {
            if (this.document.exitFullscreen) {
                this.document.exitFullscreen();
            } else if (this.document.mozCancelFullScreen) {
                /* Firefox */
                this.document.mozCancelFullScreen();
            } else if (this.document.webkitExitFullscreen) {
                /* Chrome, Safari and Opera */
                this.document.webkitExitFullscreen();
            } else if (this.document.msExitFullscreen) {
                /* IE/Edge */
                this.document.msExitFullscreen();
            }
        }
    }

    previewSurvey() {
        window.open('survey/' + this.projectId + '/' + this.biUsername);
    }

    print() {
        window.print();
    }

    // PRIVATE FUNCTIONS
    private sortArrayByTwoProperties(array, prop1, prop2) {
        return array.sort(function (b, a) {
            if (a[prop1] < b[prop1]) {
                return -1;
            } else if (a[prop1] > b[prop1]) {
                return 1;
            } else {
                if (a[prop2] > b[prop2]) {
                    return -1;
                } else if (a[prop2] > b[prop2]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }

    private diplicateArrayMultiple(array, times) {
        let result = [];
        for (let i = 0; i < times; i++) {
            result = result.concat(array);
        }
        return result;
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
