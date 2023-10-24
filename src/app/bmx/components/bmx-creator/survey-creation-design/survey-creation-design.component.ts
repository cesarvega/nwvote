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
    selector: 'app-survey-creation-design',
    templateUrl: './survey-creation-design.component.html',
    styleUrls: ['./survey-creation-design.component.scss'],
})
export class SurveyCreationDesignComponent implements OnInit {
    @Input() isMenuActive11;
    @Input() bmxClientPageDesignMode;
    @Input() bmxClientPageOverview;
    
    isMobile = true
    @Input() isBrandMatrixSurvey
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    bmxPagesClient;
    myAngularxQrCode = 'https://brandmatrix.brandinstitute.com/BMX/';
    popUpQRCode = false;
    elem: any;
    isFullscreen: any;

    @Input() widthLogo: string = "";

    showMenuCreator: boolean =  false;
    iconMenuShow: string = "add_circle_outline";
    TEMPLATE_NAME = 'Standart Personal Preference';

    model = {
        editorData: '',
        namesData: '',
    };
    TestNameDataModel: any;
    ckconfig: any;
    selectedIndex: any;
    sampleHtml = `<p style="text-align:center;color:red">Instructions</p>\n\n<p style=\"text-align:justify\"><br />\nPlease select at least three &quot;themes&quot; you would consider to move forward for the Line Draw Family.</p>\n\n<p style=\"text-align:justify\"><strong>What do we mean by &quot;theme&quot;:</strong></p>\n\n<p style=\"text-align:justify\">We will develop names that pertain to an overarching theme. Each individual name candidate will have potential to be used as an ingredient brand to be used across all Line Draw Family concepts or as it pertains to each individual concept. In the latter scenario, we will develop names with a common word part and this word part will be included in each concept name. For example, if you choose the &quot;Optimized&quot; theme, we will develop candidates around the Op/Opt/Opti word parts.</p>\n\n<p style=\"text-align:justify\"><strong>How many themes should I vote on?</strong></p>\n\n<p style=\"text-align:justify\">You can select as many as you&rsquo;d like but we request that you select at least 3 themes. Based on the vote, we will select three to five themes for full creative exploration. How do I provide a vote? To make a selection, simply click the checkbox to the left of the desired name candidate. After you make a selection, you will be asked to rate that theme based on your own personal preference on a scale from 1 to 7, 1 being neutral and 7 being the most liked.</p>\n\n<p style=\"text-align:justify\">Once you have finished your selections, please click the &quot;Continue&quot; button on the bottom of the page to proceed to the next evaluation section.</p>\n`;
    sampleHtml2 = `
    You have been chosen to participate in the selection process for Integrated BioTherapeutics' new tagline (Project Code Name: BI_PROJECTNAME). In this interactive BrandMatrix evaluation, you will be asked to identify and evaluate your favorite tagline options. 
    
    Should you have any questions or comments regarding the BrandMatrixTM, please contact one of the following individuals:
    
    BI_DIRECTOR
    
    BI_DIRECTOR1
    `;
    selectedOption: any;
    rankingScaleValue = 5;

    displayInstructions = false;

    selectedStarRatingIndex = '';
    selectedRating = 0;
    newTestNames = [];
    ratingScale = 5;

    // TEMPLATE BOX
    isTemplateBoxOn = false;
    isTemplateUpdate = false;
    isSaveOrUpdate = false;
    isOverViewPageOn = false;
    templateTitle;
    TEMPLATES = [
        { TemplateName: 'Standard Personal Preference' },
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

    UNDO = [] 

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
        // this.qrCode = new QRCodeStyling({
        //     width: 223,
        //     height: 223,
        //     data: this.myAngularxQrCode,
        //     margin: 0,
        //     qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
        //     imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
        //     dotsOptions: {
        //         type: 'dots',
        //         color: '#1023da',
        //         gradient: {
        //             type: 'linear',
        //             rotation: 45,
        //             colorStops: [
        //                 {
        //                     offset: 0,
        //                     color: '#1023da',
        //                 },
        //                 {
        //                     offset: 3,
        //                     color: '#8831da',
        //                 },
        //             ],
        //         },
        //     },
        //     backgroundOptions: { color: '#fff' },
        //     image: './assets/img/bmx/bmxCube.jpg',
        //     cornersSquareOptions: {
        //         type: 'square',
        //         color: '#000',
        //         gradient: {
        //             type: 'radial',
        //             rotation: 45,
        //             colorStops: [
        //                 {
        //                     offset: 0,
        //                     color: '#000',
        //                 },
        //             ],
        //         },
        //     },
        //     cornersDotOptions: {
        //         type: 'dot',
        //         color: '#000',
        //         gradient: {
        //             type: 'linear',
        //             rotation: 45,
        //             colorStops: [
        //                 {
        //                     offset: 0,
        //                     color: '#000',
        //                 },
        //                 {
        //                     offset: 3,
        //                     color: '#000',
        //                 },
        //             ],
        //         },
        //     },
        // });

        // TESTING ROUTER DATA
        activatedRoute.params.subscribe(params => {
            this.projectId = params['id'];
            this.biUsername = params['biUsername'];
            localStorage.setItem('projectId', this.projectId);
            // this.bsrService.getProjectData(this.projectId).subscribe(arg => {
            //   this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
            //   localStorage.setItem('projectName',  this.projectId);
            // });
        });

        // PRODUCTION DATA
        // this._BmxService. currentprojectData$.subscribe(arg => {
        //     this.projectInfo = arg;
        //     localStorage.setItem('projectInfo', this.projectInfo);
        // })

    }

    temporalWidthLogo: string = "";

    ngOnInit(): void {   

        this.isBrandMatrixSurvey = false;
        this._BmxService.currentProjectName$.subscribe(projectName => {
            this.projectId = (projectName !== '') ? projectName : this.projectId;
            localStorage.setItem('projectName', this.projectId);
        })

        this.myAngularxQrCode = this.myAngularxQrCode + this.projectId + '/' + this.biUsername

        this._BmxService.getGeneralLists()
            .subscribe((arg: any) => {
                this.TEMPLATES = (JSON.parse(arg.d).BrandMatrixTemplateList.length > 0) ?
                    JSON.parse(arg.d).BrandMatrixTemplateList.map(obj => obj.TemplateName) :
                    this.TEMPLATES
            });

        // SAMPLE DATA FOR CKEDITOR
        this.model.editorData = this.sampleHtml;
        // // TEMPLATE SELECTOR
        // if (this.TEMPLATE_NAME === 'Standard Personal Preference') {
        //     this.createNewBmxComponent('rate-scale');
        // }
        if (this.bmxPagesClient) {
            this.bmxPages = this.bmxPagesClient;            
            
        } else {
            //   this.bmxPages = this.SAMPLE_BMX;

            this._BmxService.getBrandMatrixByProject(this.projectId).subscribe((brandMatrix: any) => {
                if (brandMatrix.d.length > 0) {
                    let logoUrl = ""
                    this.bmxPages = JSON.parse(brandMatrix.d)
                    logoUrl = this.bmxPages[0].page[0].componentSettings[0].companyLogoURL;

                    for (let index = 0; index < this.bmxPages.length; index++) {
                        this.bmxPages[index].page[0].componentSettings[0].companyLogoURL = logoUrl                        
                    }
                    //console.log(this.bmxPages)
                    if(this.widthLogo != "" && this.widthLogo != undefined){
            
                        this.bmxPages.forEach((pageToreset: any) => {
                            pageToreset.page[0].componentSettings[0].logoWidth = this.widthLogo;
                        }) 
                    }
                    // this._snackBar.open('bmx LOADED for project  ' + this.projectId , 'OK', {
                    //     duration: 5000,
                    //     horizontalPosition: 'left',
                    //     verticalPosition: 'top'
                    //   })
                } else {
                    this.bmxPages = this.SAMPLE_BMX
                }

            })
        }
        if (!QRCodeStyling) {
            return;
        }

    }

    toggleInstructions() {
        this.displayInstructions = !this.displayInstructions;
    }

    checkDragEvetn(e) {
        console.log(e);
    }

    deletePage() {
        if (confirm("Are you sure you want to delete this page?")) {
            if (this.currentPage > 0) {

                this.bmxPages.splice(this.currentPage, 1)

                this.bmxPages.forEach((page, index) => {
                    page.pageNumber = index + 1
                });
                this.currentPage--
            }
        }

    }

    createPage() {
        this.bmxPages.push({
            pageNumber: this.bmxPages.length + 1,
            page: [
                {
                    "componentType": "logo-header",
                    "componentText": "templates2",
                    "componentSettings": [
                        {
                            "fontSize": "16px",
                            "fontFace": "Arial",
                            "logoWidth": 100,
                            "brandInstituteLogoURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                            "brandInstituteSurveyLogoURL": "./assets/img/bmx/bm-logo-2020-high.png",
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
                            "companyLogoURL": "./assets/img/bmx/insertLogo.jpg"
                        }
                    ]
                }
            ]
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
                        companyLogoURL: './assets/img/bmx/insertLogo.jpg',
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
                nameCandidates: 'NAME',
                rationale: 'RATIONALE',
                RATE: 'RATE',
                STARS: this.createRatingStars(),
            });
            for (let index = 0; index < 5; index++) {
                this.TestNameDataModel.push({
                    nameCandidates: 'TEST NAME ' + index,
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
                        randomizeTestNames: false,
                        language: 'english',
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 175,
                        rationalewidth: 250,
                        rowHeight: 0,
                        radioColumnsWidth: 75,
                        nameCandidatesWidth: 135,
                        rateWidth: 135,
                        commentsWidth: 165,
                        CRITERIA: false,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category Rate',
                        categoryDescription: 'This is Rate matrix',
                        ratingScaleTitle: 'RATING'
                    },
                ],
            });
        } // 💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚
        else if (componentType === 'ranking-scale') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                nameCandidates: 'NAME',
                rationale: 'RATIONALE',
                RATE: 'RATE',
                STARS: this.createRankinScale(),
            });
            for (let index = 0; index < 5; index++) {
                this.TestNameDataModel.push({
                    nameCandidates: 'TEST NAME ' + index,
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
                        randomizeTestNames: false,
                        language: 'english',
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 150,
                        rationalewidth: 250,
                        rowHeight: 0,
                        radioColumnsWidth: 75,
                        nameCandidatesWidth: 135,
                        rateWidth: 135,
                        commentsWidth: 165,
                        selectedRanking: 7,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category Ranking',
                        categoryDescription: 'This is Ranking matrix',
                        ratingScaleTitle: 'RANK',
                        rankType: 'dropDown',
                    },
                    {
                        isImageType: false,
                        categoryTobeRender: '',
                        isSpecialRquest: false,
                    }
                ],
            });
        } // 💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚
        else if (componentType === 'image-rank-drag') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                nameCandidates: 'NAME',
                rationale: 'RATIONALE',
                RATE: 'RATE',
                STARS: this.createRankinScale(),
            });
            for (let index = 0; index < 5; index++) {
                this.TestNameDataModel.push({
                    nameCandidates: 'TEST NAME ' + index,
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
                        randomizeTestNames: false,
                        language: 'english',
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 150,
                        rationalewidth: 250,
                        rowHeight: 0,
                        radioColumnsWidth: 75,
                        nameCandidatesWidth: 135,
                        rateWidth: 135,
                        commentsWidth: 165,
                        selectedRanking: 7,
                        categoryRulesPassed: false,
                        ratedCounter: 0,
                        categoryName: 'Category image-rank-drag',
                        categoryDescription: 'This is image-rank-drag matrix',
                        ratingScaleTitle: 'RANK',
                        rankType: 'dragAndDrop',
                    },
                    {
                        isImageType: false,
                        categoryTobeRender: '',
                        isSpecialRquest: false,
                    }
                ],
            });
        } // ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
        else if (componentType === 'image-rate-scale') {
            this.TestNameDataModel = [];
            this.TestNameDataModel.push({
                // name: '',
                nameCandidates: 'LOGO',
                // logoURL:''
                RATE: 'RATE',
                // STARS: this.createRatingStars()
            });
            for (let index = 0; index < 5; index++) {
                let imageIndex = index + 1;
                this.TestNameDataModel.push({
                    // name: 'TEST NAME ' + index,
                    nameCandidates:
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
                        randomizeTestNames: false,
                        language: 'english',
                        minRule: 0,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 336,
                        rationalewidth: 250,
                        rowHeight: 0,
                        radioColumnsWidth: 75,
                        nameCandidatesWidth: 323,
                        rateWidth: 135,
                        commentsWidth: 165,
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
                RATE: 'RATE',
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
                        minRule: 3,
                        maxRule: 0,
                        fontSize: 16,
                        columnWidth: 150,
                        rationalewidth: 250,
                        rowHeight: 0,
                        radioColumnsWidth: 75,
                        nameCandidatesWidth: 135,
                        rateWidth: 135,
                        commentsWidth: 165,
                        categoryRulesPassed: false,
                        selectedRowCounter: 0,
                        ratedCounter: 0,
                        ratingScaleNarrowDownTitle: 'SELECT',
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
                        randomizeTestNames: false,
                        language: 'english',
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
                        randomizeTestNames: false,
                        language: 'english',
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
        else if (componentType === 'page-title') {
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
            this.bmxPages[this.currentPage].page.unshift({
                componentType: componentType,
                componentText: this.TestNameDataModel,
                componentSettings: [
                    {
                        fontSize: "16px",
                        fontFace: "Arial",
                        logoWidth: 250,
                        pageTitle: 'TEXT TITLE',
                        pageContent: `
                        This section details who participated in the BrandMatrixTM
                        Percentage of participants who have completed the BrandMatrixTM
                        (6 out of 6)`,
                        brandInstituteLogoURL: "./assets/img/bmx/BILogo-Regular_.png",
                        DSILogo: "./assets/img/bmx/DSI-LOGO.svg",
                        brandInstituteMobileURL: "./assets/img/bmx/bmxCube.jpg",
                        backgroundgraphic: "./assets/img/bmx/cover-graphic.jpg",
                        companyLogoURL: "./assets/img/bmx/insertLogo.jpg"
                    }
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
        if (confirm('Are you sure you want to delete this component?')) {
            this.bmxPages[this.currentPage].page.splice(i, 1);
        }
    }

    // TEMPLATE METHODS
    saveOrUpdateTemplate(templateName) {
        if (confirm('Are you sure you want to save or update ' + templateName + ' template?')) {
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
                //this.openSaveTemplateBox();
            }, 1000);

        }
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
        //this.openSaveTemplateBox();
    }

    deleteTemplate(templateName) {
        // if (localStorage.getItem(templateName)) {
        //   this.bmxPages = JSON.parse(localStorage.getItem(templateName));
        // }
        if (confirm('Are you sure you want to delete ' + templateName + ' template?')) {
            this._BmxService.deleteBrandMatrixTemplateByName(templateName, this.biUserId).subscribe((template: any) => {
                this._snackBar.open('template ' + "'" + templateName + "'" + ' deleted 😳', 'OK', {
                    duration: 5000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                })
            })
        }


        this.openSaveTemplateBox();
    }

    resetTemplate() {
        if (confirm("Are you sure you want to reset this template?")) {

            this.bmxPages = [
                {
                    pageNumber: 1,
                    page: [
                        {
                            "componentType": "logo-header",
                            "componentText": "templates2",
                            "componentSettings": [
                                {
                                    "fontSize": "16px",
                                    "fontFace": "Arial",
                                    "logoWidth": 100,
                                    "brandInstituteLogoURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                                    "brandInstituteSurveyLogoURL": "./assets/img/bmx/bm-logo-2020-high.png",
                                    "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
                                    "companyLogoURL": "./assets/img/bmx/insertLogo.jpg"
                                }
                            ]
                        }
                    ]
                },
            ];
        }
    }


    templateSelected() {
        this.isSaveOrUpdate = true;
    }


    delete() {
        this.isTemplateBoxOn = true;
    }


    openSaveTemplateBox() {
        this.templateName = '';
        this.templateTitle = 'save';
        this.isTemplateBoxOn = !this.isTemplateBoxOn;
    }

    openUploadDeleteLoadTemplateBox() {
        this.templateName = '';
        this.templateTitle = 'update or load a template';
        this.isTemplateUpdate = !this.isTemplateUpdate;
    }

    saveData() {
        // RESET VOTES IN TEMPLATE
        this.bmxPages.forEach((pageToreset: any) => {    

            pageToreset.page.forEach(category => {
                if (
                    category.componentType == 'rate-scale' ||
                    category.componentType == 'ranking-scale' ||
                    category.componentType == 'image-rate-scale' ||
                    category.componentType == 'narrow-down' ||
                    category.componentType == 'question-answer'
                ) {
                    if (category.componentSettings[0].CRITERIA) {
                        category.componentText.forEach((row: any, index: number) => {
                            if (index > 0) {
                                row.CRITERIA.forEach((criteria: any) => {
                                    criteria.RATE = -1;
                                    criteria.STARS.forEach((star: any) => {
                                        star.styleClass = 'rating-star'
                                    });
                                });
                            }
                        });
                    } else {
                        if (
                            category.componentType == 'rate-scale' ||
                            category.componentType == 'ranking-scale' ||
                            category.componentType == 'image-rate-scale' ||
                            category.componentType == 'narrow-down' ||
                            category.componentType == 'question-answer'
                        ) {
                            category.componentText.forEach((row: any, index: number) => {
                                if (index > 0) {
                                    row.RATE = -1;
                                    if (row.STARS) {
                                        row.STARS.forEach((star: any) => {
                                            star.styleClass = 'rating-star'
                                        });
                                    }
                                }

                            });
                        }
                    }

                }

            });
        });

        if (confirm('Are you sure you want save overwrite this project?')) {

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
                .subscribe((res:any) => {                    
                    let logoUrl = ""
                    this.bmxPages = JSON.parse(res.d)
                    logoUrl = this.bmxPages[0].page[0].componentSettings[0].companyLogoURL;

                    for (let index = 0; index < this.bmxPages.length; index++) {
                        this.bmxPages[index].page[0].componentSettings[0].companyLogoURL = logoUrl                        
                    }
                    // console.log('%cBMX!', 'color:orange', res);
                    this._snackBar.open('Project ' + this.projectId + ' saved', 'OK', {
                        duration: 5000,
                        verticalPosition: 'top',
                    })
                });
        }
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
        window.open('survey/' + this.projectId + '/' + (this.biUsername ? this.biUsername : 'guest'));
    }


    SAMPLE_BMX = [
        {
            "pageNumber": 1,
            "page": [
                {
                    "componentType": "logo-header",
                    "componentText": "templates2",
                    "componentSettings": [
                        {
                            "fontSize": "16px",
                            "fontFace": "Arial",
                            "logoWidth": 100,
                            "brandInstituteLogoURL": "./assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg",
                            "brandInstituteSurveyLogoURL": "./assets/img/bmx/bm-logo-2020-high.png",
                            "brandInstituteMobileURL": "./assets/img/bmx/bmxCube.jpg",
                            "companyLogoURL": "./assets/img/bmx/insertLogo.jpg"
                        }
                    ]
                }
            ]
        }
    ]

    showMenucreateNewBmx(){
        this.showMenuCreator = !this.showMenuCreator;
        if(this.showMenuCreator){
            this.iconMenuShow = "remove_circle_outline"
        }else{
            this.iconMenuShow = "add_circle_outline"
        }
    }

    logoChanged(logoUrl: any){
        for (let index = 0; index < this.bmxPages.length; index++) {
            this.bmxPages[index].page[0].componentSettings[0].companyLogoURL = logoUrl                        
        }        
    }

    resizeWidthLogo(event: any){
        this.temporalWidthLogo = event;
        this.bmxPages.forEach((pageToreset: any) => {
            pageToreset.page[0].componentSettings[0].logoWidth = this.temporalWidthLogo
        }) 
    }
}
// https://brandmatrix.brandinstitute.com/BMX/survey/ImageStarRate/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/ImageStarRateCriteria/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/rateEstrella/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/StartRateCriteria/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/TopRankDragAndDrop/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/TopRankDropDown/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/TopRankRadio/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/MiltipleChoice/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/MultipleChoiceWithComments/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/NarrowDown/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/NarrowDownCriteria/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/SpecialRequestLogos/guest
// https://brandmatrix.brandinstitute.com/BMX/survey/Tinder/guest