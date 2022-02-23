import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BmxService } from '../bmx.service';
import { DOCUMENT } from '@angular/common';
import QRCodeStyling from 'qr-code-styling';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { faFileWord } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-reports',
  templateUrl: './project-reports.component.html',
  styleUrls: ['./project-reports.component.scss'],
})
export class ProjectReportsComponent implements OnInit {
  @Input() isMenuActive16: boolean = true;
  @Input() bmxClientPageDesignMode = false;
  @Input() bmxClientPageOverview = false;
  isMobile = true;
  @Input() isBrandMatrixSurvey;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  wordIcon = faFileWord;

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
  commentsList = {};

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

  REPORT_DATA = [];
  REPORT_USER_DATA = [];
  BMX_REPORT = [];
  categoryCounter = 0;
  categorySortedgArray = [];
  pageBreakArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  reportType = '';
  usersList: any[];
  answersByAllUsers: any;
  displayWordDocument: boolean;
  reportSettings = {
    displayCompletionStatus: true,
    displayOverallRanking: true,
    OverallRankingWithRespondents: true,
    openEndedQuestions: true,
    openEndedWithRepondents: true,
    displayResultsByRespondents: true,
  }
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  numberOfpages = [];
  constructor(
    @Inject(DOCUMENT) private document: any,
    public _BmxService: BmxService,
    public _snackBar: MatSnackBar,
    private _hotkeysService: HotkeysService,
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

    this._BmxService.currentProjectName$.subscribe((projectName) => {
      this.projectId = projectName !== '' ? projectName : this.projectId;
      localStorage.setItem('projectName', this.projectId);
    });

    this._hotkeysService.add(
      new Hotkey(
        'ctrl+`',
        (event: KeyboardEvent): boolean => {
          this.bmxClientPageOverview = !this.bmxClientPageOverview;
          return false;
        },
        undefined,
        'Hide/Show slide overview'
      )
    );
  }

  ngOnInit(): void {
    this.myAngularxQrCode =
      this.myAngularxQrCode + this.projectId + '/' + this.biUsername;

    this._BmxService
      .getBrandMatrixByProject(this.projectId + '_REPORT')
      .subscribe((brandMatrix: any) => {
        if (brandMatrix.d.length > 0) {
          this.bmxPages = JSON.parse(brandMatrix.d);

          // this._snackBar.open('bmx LOADED for project  ' + this.projectId , 'OK', {
          //     duration: 5000,
          //     horizontalPosition: 'left',
          //     verticalPosition: 'top'
          //   })
        } else {
          this._BmxService
            .getBrandMatrixByProjectAllUserAnswers(this.projectId)
            .subscribe((brandMatrix: any) => {
              if (brandMatrix.d.length > 0) {
                this.answersByAllUsers = JSON.parse(brandMatrix.d);

                // Simulate multiple users function, for testing only
                const milUsers = this.diplicateArrayMultiple(
                  this.answersByAllUsers,
                  1
                );

                this.getAndCalculateReport(milUsers);
                this.usersList = milUsers.map((user) => user.Username);
              }
            });
        }
        this.bmxPages = this.SAMPLE_BMX;
      });
  }
  // ☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️
  getAndCalculateReport(milUsers) {
    this.BMX_REPORT = [];
    this.REPORT_USER_DATA = [];
    this.categorySortedgArray = [];

    // RETURN THE NUMBER OF PAGES 
    JSON.parse(milUsers[0].BrandMatrix).map(res => {
      res.page.forEach(page => {
        if (
          page.componentType == 'rate-scale' ||
          page.componentType == 'ranking-scale' ||
          page.componentType == 'image-rate-scale' ||
          page.componentType == 'narrow-down' ||
          page.componentType == 'tinder' ||
          page.componentType == 'question-answer'
        ) {
          this.numberOfpages.push(res.pageNumber)
        }
      })
    })

    milUsers.forEach((userAnswer, userAnswerIndex) => {
      this.categoryCounter = 0;
      let userCategory = [];
      JSON.parse(userAnswer.BrandMatrix).forEach((page) => {
        page.page.forEach((component) => {
          if (
            component.componentType == 'rate-scale' ||
            component.componentType == 'ranking-scale' ||
            component.componentType == 'image-rate-scale' ||
            component.componentType == 'narrow-down' ||
            component.componentType == 'tinder' ||
            component.componentType == 'question-answer'
          ) {
            // CATEGORIES
            this.reportType = component.componentType;
            this.categoryCounter++;
            if (userAnswerIndex == 0) {
              let categoryObj = new Object();
              categoryObj['category_' + this.categoryCounter] = [];
              this.BMX_REPORT.push(categoryObj);
            }
            component.componentText.forEach((row, rowIndex) => {
              if (rowIndex > 0) {
                this.computeReport(
                  row,
                  component,
                  userAnswer.Username,
                  this.BMX_REPORT[this.categoryCounter - 1][
                  'category_' + this.categoryCounter
                  ],
                  this.reportType
                );
                console.log(
                  'COMPUTED',
                  this.BMX_REPORT[this.categoryCounter - 1][
                  'category_' + this.categoryCounter
                  ]
                );
              }
            });
            //🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈 USERS RESULTS
            let userName = {
              username: userAnswer.Username,
              content: component.componentText,
              componentType: component.componentType,
            };
            this.REPORT_USER_DATA.push(userName); //🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
          }
        });
      });
    });

    //  SORTING REPORT BY SCORE 🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩
    let sortIngArray = [];
    this.BMX_REPORT.forEach((category, categoryIndex) => {
      const sortedCategory = Object.keys(category)[0];
      Object.keys(category[sortedCategory]).forEach((key, keyIndex) => {
        this.BMX_REPORT[categoryIndex][sortedCategory][key].totalScore;
        sortIngArray.push({
          rank: categoryIndex + 1,
          nameCandidates: key,
          score: this.BMX_REPORT[categoryIndex][sortedCategory][key].totalScore,
          comments:
            this.BMX_REPORT[categoryIndex][sortedCategory][key].comments,
        });
      });
      if (this.reportType === 'ranking-scale') {
        this.categorySortedgArray.push(
          this.inverseSortArrayByTwoProperties(
            sortIngArray,
            'score',
            'nameCandidates'
          )
        );
      } else {
        this.categorySortedgArray.push(
          this.sortArrayByTwoProperties(sortIngArray, 'score', 'nameCandidates')
        );
      }
      sortIngArray = [];
    });

    this.bmxPages = [
      {
        pageNumber: 1,
        page: [
          {
            componentType: 'first-page',
            componentText: 'ratetoprank',
            componentSettings: [
              {
                fontSize: '16px',
                fontFace: 'Arial',
                logoWidth: 250,
                brandInstituteLogoURL: './assets/img/bmx/BILogo-Regular_.png',
                DSILogo: './assets/img/bmx/DSI-LOGO.svg',
                brandInstituteMobileURL: './assets/img/bmx/bmxCube.jpg',
                backgroundgraphic: './assets/img/bmx/cover-graphic.jpg',
                companyLogoURL: './assets/img/bmx/insertLogo.jpg',
              },
            ],
          },
          {
            componentType: 'text-editor',
            componentText: `

                              <p style="text-align:center">BRANDMATRIXTM COMPLETION STATUS</p>

                              <p style="text-align:center">This section details who participated in the BrandMatrixTM</p>

                              <p style="text-align:center">Percentage of participants who have completed the BrandMatrixTM = 100%</p>

                              <p style="text-align:center">(6 out of 6)</p>

                              <p style="text-align:center">&nbsp;</p>
                              `,
            componentSettings: [
              {
                fontSize: '16',
                fontFace: 'Arial',
                fontColor: 'red',
              },
            ],
          },
          {
            componentType: 'rate-scale',
            componentText: [
              {
                STARS: [
                  {
                    id: 1,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 2,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 3,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 4,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 5,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                ],
                nameCandidates: 'NameCandidates',
                ExtraColumn1: 'Email',
                ExtraColumn2: 'Status',
              },
              {
                STARS: [
                  {
                    id: 1,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 2,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 3,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 4,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 5,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                ],
                nameCandidates: 'Andrew Levin',
                ExtraColumn1: 'alevin@racap.com',
                ExtraColumn2: 'BM Completed',
              },
              {
                STARS: [
                  {
                    id: 1,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 2,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 3,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 4,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 5,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                ],
                nameCandidates: 'DA Gros',
                ExtraColumn1: 'dag@imbria.com',
                ExtraColumn2: 'BM Completed',
              },
              {
                STARS: [
                  {
                    id: 1,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 2,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 3,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 4,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 5,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                ],
                nameCandidates: 'Jai Patel',
                ExtraColumn1: 'jp@imbria.com',
                ExtraColumn2: 'BM Completed',
              },
              {
                STARS: [
                  {
                    id: 1,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 2,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 3,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 4,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 5,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                ],
                nameCandidates: 'Neil Buckley',
                ExtraColumn1: 'neil.buckley@carnotpharma.com',
                ExtraColumn2: 'BM Completed',
              },
              {
                STARS: [
                  {
                    id: 1,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 2,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 3,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 4,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 5,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                ],
                nameCandidates: 'Paul Chamberlain',
                ExtraColumn1: 'pc@imbria.com',
                ExtraColumn2: 'BM Completed',
              },
              {
                STARS: [
                  {
                    id: 1,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 2,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 3,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 4,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                  {
                    id: 5,
                    icon: 'grade',
                    styleClass: 'rating-star',
                  },
                ],
                nameCandidates: 'Rose Harrison',
                ExtraColumn1: 'rharrison@racap.com',
                ExtraColumn2: 'BM Completed',
              },
            ],
            componentSettings: [
              {
                minRule: 0,
                maxRule: 0,
                fontSize: 16,
                columnWidth: 308,
                rationalewidth: 250,
                rowHeight: 2,
                radioColumnsWidth: 75,
                CRITERIA: false,
                categoryRulesPassed: false,
                ratedCounter: 0,
                categoryName: '',
                categoryDescription: '',
                ratingScaleTitle: 'RATING',
              },
            ],
          },
        ],
      },
    ];

    console.log(this.bmxPages[this.currentPage].page);
    console.log(this.BMX_REPORT);
    console.log(this.categorySortedgArray);

    //🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈//🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈//🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈//🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈//🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈//🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈//🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈//🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
    this.sampleHtml2 =
      '<P style="text-align: center;font-size: 30px;color: #324395;">OVERALL RANKING BY TEST NAME</P>';
    this.createNewBmxComponent('text-editor');
    this.createReportPerCategory();
    this.sampleHtml2 =
      '<P style="text-align: center;font-size: 30px;color: #324395;">VOTES BY RESPONDENT</P>';
    this.createNewBmxComponent('text-editor');
    this.createReportByUsername({
      type: this.reportType,
    });
    this.sampleHtml2 = `<p style="text-align:center;color:#324395;font-weight: 500;font-size: 25px;">USE THE EDITOR TO EDIT THIS TEXT</p>`;
  }

  // ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️
  computeReport(row, templateComponent, username, REPORT_DATA, reportType) {
    // 💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜
    if (
      templateComponent.componentType == 'rate-scale' ||
      templateComponent.componentType == 'image-rate-scale' ||
      templateComponent.componentType == 'ranking-scale'
    ) {
      if (templateComponent.componentSettings[0].CRITERIA) {
        if (REPORT_DATA[row.nameCandidates]) {
          REPORT_DATA[row.nameCandidates].scores.forEach(
            (Score, scoreIndex) => {
              REPORT_DATA[row.nameCandidates].totalScore +=
                row.CRITERIA[scoreIndex].RATE < 0
                  ? 0
                  : row.CRITERIA[scoreIndex].RATE;
            }
          );
          if (row.Comments1?.length > 0) {
            REPORT_DATA[row.nameCandidates].comments.push({
              userName: username,
              comment: row.Comments1,
            });
          }
        } else {
          let rateArray = [];
          let totalScore = 0;
          row.CRITERIA.forEach((criteria) => {
            rateArray.push({
              name: criteria.name,
              score: criteria.RATE > 0 ? criteria.RATE : 0,
            });
            totalScore += criteria.RATE > 0 ? criteria.RATE : 0;
          });
          let comment =
            row.Comments1?.length > 0
              ? { userName: username, comment: row.Comments1 }
              : undefined;
          REPORT_DATA[row.nameCandidates] = {
            category: templateComponent.componentType,
            testName: row.nameCandidates,
            rationale: row.rationale,
            comments: [comment],
            scores: rateArray,
            totalScore: totalScore,
          };
        } // 💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜💜
      } else {
        if (REPORT_DATA[row.nameCandidates]) {
          if (row.RATE > 0) {
            REPORT_DATA[row.nameCandidates].scores.push(row.RATE);
            REPORT_DATA[row.nameCandidates].totalScore += row.RATE;
            // REPORT_DATA[row.nameCandidates].row.push(row)
          }
          if (row.Comments1?.length > 0) {
            REPORT_DATA[row.nameCandidates].comments.push({
              userName: username,
              comment: row.Comments1,
            });
          }
        } else {
          let comment =
            row.Comments1?.length > 0
              ? { userName: username, comment: row.Comments1 }
              : undefined;
          REPORT_DATA[row.nameCandidates] = {
            category: templateComponent.componentType,
            // row: [row],
            // user: username,
            testName: row.nameCandidates,
            rationale: row.rationale,
            comments: [comment],
            scores: [row.RATE > 0 ? row.RATE : 0],
            totalScore: row.RATE > 0 ? row.RATE : 0,
          };
        }
        const _comment =
          row.Comments1?.length > 0
            ? { userName: username, comment: row.Comments1 }
            : undefined;
        if (_comment) {
          if (this.commentsList[row.nameCandidates]) {
            this.commentsList[row.nameCandidates].push(_comment);
          } else {
            this.commentsList[row.nameCandidates] = [_comment];
          }
        }
      }
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
          REPORT_DATA[row.nameCandidates].scores.push(row.RATE);
          REPORT_DATA[row.nameCandidates].totalScore += row.RATE;
        }
        if (row.Comments1?.length > 0) {
          REPORT_DATA[row.nameCandidates].comments.push({
            userName: username,
            comment: row.Comments1,
          });
        }
      } else {
        let comment =
          row.Comments1?.length > 0
            ? { userName: username, comment: row.Comments1 }
            : undefined;
        REPORT_DATA[row.nameCandidates] = {
          category: templateComponent.componentType,
          testName: row.nameCandidates,
          rationale: row.rationale,
          comments: [comment],
          scores: [row.RATE > 0 ? row.RATE : 0],
          totalScore: row.RATE > 0 ? row.RATE : 0,
        };
      }
    }
    // 💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛
    else if (templateComponent.componentType == 'question-answer') {
    }
    //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    else if (templateComponent.componentType == 'tinder') {
      this.rowCalculator['test name'] = row.nameCandidates;
      this.rowCalculator['positiveRank'] += row.vote == 'positive' ? 1 : '';
      this.rowCalculator['negatvieRank'] += row.vote == 'negative' ? 1 : '';
    }
  }

  // 💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚
  createReportPerCategory() {
    let component;
    this.categorySortedgArray.forEach((category, categoryIndex) => {
      // if (categoryIndex == 0) {

      component = {
        componentType: 'rate-scale',
        componentText: [],
        componentSettings: [
          {
            minRule: 0,
            maxRule: 0,
            fontSize: 16,
            columnWidth: 175,
            rationalewidth: 250,
            rowHeight: 0,
            radioColumnsWidth: 75,
            nameCandidatesWidth: 135,
            rateWidth: 135,
            commentsWidth: 135,
            CRITERIA: false,
            categoryRulesPassed: false,
            ratedCounter: 0,
            categoryName: 'Name Candidates',
            categoryDescription: 'With Max Rate Amount',
            ratingScaleTitle: 'Rate from 1 to 7',
          },
        ],
      };
      let comments;
      category.forEach((row, rowIndex) => {
        const rowObj = {};
        row['rank'] = rowIndex + 1;

        let nameCandidates;

        if (this.reportType === 'image-rate-scale') {
          nameCandidates = row.nameCandidates;
          row.nameCandidates = '<img src=' + row.nameCandidates + '>';
        }

        if (rowIndex == 0) {
          //    CALUCULATING THE ROW HEEADERS
          Object.keys(row).forEach((key, keyIndex) => {
            rowObj[key] = key;
          });
          component.componentText.push(rowObj);
          row['Rank'] = rowIndex + 1;
          component.componentText.push(row);
        } else {
          component.componentText.push(row);

          //if (Array.isArray(row.comments)) {
          //    row.comments.forEach((comment, index, commnetsArray) => {
          //        if (comment) {
          //
          //            comments = `<div style="color: #ee7f25;">>>>>` + comment.userName + `: ` +
          //                `<span style="color: #324395;">` + comment.comment + `</span>` + `</div>`
          //            commnetsArray[index] = comments + `\n`
          //        }
          //    });
          //    component.componentText[rowIndex].comments = row.comments.join('').toString()
          //} else {
          //    component.componentText[rowIndex].comments = row.comments
          //}
        }

        row.comments = (this.commentsList[nameCandidates] || [])
          .map(
            (comment) =>
              `<div style="color: #ee7f25;">` +
              comment.userName +
              `: ` +
              `<span style="color: #324395;">` +
              comment.comment +
              `</span>` +
              `</div>`
          )
          .join('\n')
          .toString();
      });
      // }
      this.bmxPages[this.currentPage].page.push(component);
    });
  }

  // ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
  createReportByUsername(options) {
    let component;
    this.REPORT_USER_DATA.forEach((category, categoryIndex) => {
      // recreate rows to be display by the master matrix
      let newCat = category.content.map((row, rowIndex) => {
        let newRow = {};
        if (row.CRITERIA) {
          // IF CRITERIA
          row.CRITERIA.forEach((criteria) => {
            newRow[criteria.name] = criteria.name;
          });

          // CALUCULATING THE ROW HEEADERS
          Object.keys(row).forEach((key) => {
            if (rowIndex === 0) {
              newRow['Score'] = 'Score';
              // newRow['Rank'] = 'Rank'
            } else {
              newRow['Score'] = 0;
            }
            if (key === 'STARS' || key === 'RATE') {
              // newRow[key] = row[key]
            } else {
              newRow[key] = row[key];
            }
          });
          // CALCULATIN SCORES FOR EACH ROW
          Object.keys(newRow).forEach((key) => {
            if (rowIndex !== 0) {
              row.CRITERIA.forEach((criteria) => {
                if (key === criteria.name) {
                  newRow[key] = criteria.RATE > 0 ? criteria.RATE : 0;
                  newRow['Score'] += criteria.RATE > 0 ? criteria.RATE : 0;
                }
                // newRow['Rank'] = rowIndex
              });
            }
          });
        } else {
          Object.keys(row).forEach((key, index) => {
            if (rowIndex === 0) {
              newRow['Score'] = 'Score';
            }
            if (rowIndex === 0) {
              newRow['Rank'] = 'Rank';
            } else {
              newRow['Rank'] = rowIndex;
            }
            if (key === 'RATE') {
              if (rowIndex !== 0) {
                newRow['Score'] = row[key] == undefined ? '0' : row[key];
              }
            } else if (key === 'STARS') {
              // newRow[key] = row[key]
            } else {
              if (
                key === 'nameCandidates' &&
                options?.type === 'image-rate-scale' &&
                rowIndex > 0
              ) {
                newRow[key] = `<img src="${row[key]}">`;
              } else newRow[key] = row[key];
            }
          });
        }
        return newRow;
      });

      // sort rows by core and testname aphabetical
      let firstRowHeaders = newCat.splice(0, 1)[0];
      firstRowHeaders = { Rank: 'Rank', ...firstRowHeaders };
      if (category.componentType === 'ranking-scale') {
        newCat = this.inverseSortArrayByTwoProperties(
          newCat,
          'Score',
          'nameCandidates'
        );
      } else {
        newCat = this.sortArrayByTwoProperties(
          newCat,
          'Score',
          'nameCandidates'
        );
      }
      newCat.forEach((row, rowIndex) => {
        row['Rank'] = rowIndex + 1;
      });
      newCat.unshift(firstRowHeaders);

      component = {
        componentType: 'rate-scale',
        componentText: newCat,
        componentSettings: [
          {
            minRule: 0,
            maxRule: 0,
            fontSize: 16,
            columnWidth: 175,
            rationalewidth: 250,
            rowHeight: 0,
            radioColumnsWidth: 75,
            nameCandidatesWidth: 135,
            rateWidth: 135,
            commentsWidth: 135,
            CRITERIA: false,
            categoryRulesPassed: false,
            ratedCounter: 0,
            categoryName: category.username,
            categoryDescription: 'results by user sorted',
            ratingScaleTitle: 'Rate from 1 to 7',
          },
        ],
      };

      this.bmxPages[this.currentPage].page.push(component);
    });
  }

  filterReport() {
    let filteredReport = ['cvega1'];

    const filtered = this.answersByAllUsers.filter((user) => {
      if (filteredReport.indexOf(user.Username) >= 0) {
        return user;
      }
    });

    // Simulate multiple users function, for testing only
    const milUsers = this.diplicateArrayMultiple(filtered, 1);

    this.getAndCalculateReport(milUsers);
  }

  toggleInstructions() {
    this.displayInstructions = !this.displayInstructions;
  }

  checkDragEvetn(e) {
    console.log(e);
  }

  deletePage() {
    if (this.currentPage > 0) {
      this.bmxPages.splice(this.currentPage, 1);

      this.bmxPages.forEach((page, index) => {
        page.pageNumber = index + 1;
      });
      this.currentPage--;
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
            brandInstituteLogoURL:
              './assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg',
            brandInstituteSurveyLogoURL:
              './assets/img/bmx/bm-logo-2020-high.png',
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
            minRule: 0,
            maxRule: 0,
            fontSize: 16,
            columnWidth: 175,
            rationalewidth: 250,
            rowHeight: 0,
            radioColumnsWidth: 75,
            nameCandidatesWidth: 135,
            rateWidth: 135,
            commentsWidth: 135,
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
            minRule: 0,
            maxRule: 0,
            fontSize: 16,
            columnWidth: 150,
            rationalewidth: 250,
            rowHeight: 0,
            radioColumnsWidth: 75,
            nameCandidatesWidth: 135,
            rateWidth: 135,
            commentsWidth: 135,
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
            minRule: 0,
            maxRule: 0,
            fontSize: 16,
            columnWidth: 336,
            rationalewidth: 250,
            rowHeight: 0,
            radioColumnsWidth: 75,
            nameCandidatesWidth: 323,
            rateWidth: 135,
            commentsWidth: 135,
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
            commentsWidth: 135,
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
    } // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
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
    } // ☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️
    else if (componentType === 'page-line-break') {
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
    } else if (componentType === 'page-title') {
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
            fontSize: '16px',
            fontFace: 'Arial',
            logoWidth: 250,
            pageTitle: 'TEXT TITLE',
            pageContent: `
                      This section details who participated in the BrandMatrixTM
                      Percentage of participants who have completed the BrandMatrixTM
                      (6 out of 6)`,
            brandInstituteLogoURL: './assets/img/bmx/BILogo-Regular_.png',
            DSILogo: './assets/img/bmx/DSI-LOGO.svg',
            brandInstituteMobileURL: './assets/img/bmx/bmxCube.jpg',
            backgroundgraphic: './assets/img/bmx/cover-graphic.jpg',
            companyLogoURL: './assets/img/bmx/insertLogo.jpg',
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

    this._BmxService
      .saveBrandMatrixTemplate(templateName, this.bmxPages, this.biUserId)
      .subscribe((template: any) => {
        this.templateTitle = "Template '" + templateName + "' saved 🧐";
        this._snackBar.open(this.templateTitle, 'OK', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });

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
    this._BmxService
      .getBrandMatrixTemplateByName(templateName)
      .subscribe((template: any) => {
        this.bmxPages = JSON.parse(template.d);
        this._snackBar.open(
          'template ' + "'" + templateName + "'" + ' loaded 😀',
          'OK',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
      });
    this.openSaveTemplateBox();
  }

  deleteTemplate(templateName) {
    // if (localStorage.getItem(templateName)) {
    //   this.bmxPages = JSON.parse(localStorage.getItem(templateName));
    // }
    this._BmxService
      .deleteBrandMatrixTemplateByName(templateName, this.biUserId)
      .subscribe((template: any) => {
        this._snackBar.open(
          'template ' + "'" + templateName + "'" + ' deleted 😳',
          'OK',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
      });

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
                brandInstituteURL:
                  './assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg',
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

    this.projectId = this.projectId + '_REPORT';

    // this._BmxService
    //     .saveOrUpdateBradnMatrixTemplate(this.bmxPages, this.projectId)
    //     .subscribe((res) => {
    //         console.log('%cBMX!', 'color:orange', res);
    //         this._snackBar.open('Project ' + this.projectId + ' saved', 'OK', {
    //             duration: 5000,
    //             verticalPosition: 'top',
    //         })
    //     });
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

  createPageMarker() {
    this.pageBreakArray.push(1);
  }
  deletePageMarker() {
    this.pageBreakArray.pop();
  }

  // PRIVATE FUNCTIONS
  private sortArrayByTwoProperties(array, prop1, prop2) {
    return array.sort(function (b, a) {
      if (a[prop1] < b[prop1]) {
        return -1;
      } else if (a[prop1] > b[prop1]) {
        return 1;
      } else {
        if (a[prop2] < b[prop2]) {
          return -1;
        } else if (a[prop2] > b[prop2]) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }
  private inverseSortArrayByTwoProperties(array, prop1, prop2) {
    return array.sort(function (b, a) {
      if (a[prop1] > b[prop1]) {
        return -1;
      } else if (a[prop1] < b[prop1]) {
        return 1;
      } else {
        return 0;
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

  displayWordDocumentWindow() {
    this.displayWordDocument = !this.displayWordDocument;
  }

  SAMPLE_BMX = [
    {
      pageNumber: 1,
      page: [
        {
          componentType: 'logo-header',
          componentText: 'Project Brand Matrix',
          componentSettings: [
            {
              fontSize: '16px',
              fontFace: 'Arial',
              logoWidth: 100,
              brandInstituteLogoURL:
                './assets/img/bmx/BRANDMATRIX-DASHBOARD-LOGO.svg',
              brandInstituteSurveyLogoURL:
                './assets/img/bmx/bm-logo-2020-high.png',
              brandInstituteMobileURL: './assets/img/bmx/bmxCube.jpg',
              companyLogoURL: './assets/img/bmx/BD.png',
            },
          ],
        },
        {
          componentType: 'text-editor',
          componentText:
            '<p style="text-align:center">BrandMatrixTM Report</p>\n\n<p style="text-align:center">Project: ICELAND</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                \n                                <p style="text-align:center">Created: Monday, January 20, 2020</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                \n                                <p style="text-align:center">TABLE OF CONTENTS</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                \n                                <p style="text-align:center">BRANDMATRIXTM OVERVIEW&nbsp;</p>\n                                \n                                <p style="text-align:center">PROJECT BACKGROUND&nbsp;</p>\n                                \n                                <p style="text-align:center">LEGEND&nbsp;</p>\n                                \n                                <p style="text-align:center">BRANDMATRIXTM COMPLETION STATUS&nbsp;</p>\n                                \n                                <p style="text-align:center">OVERALL RANKING BY TEST NAME&nbsp;</p>\n                                \n                                <p style="text-align:center">VOTES BY RESPONDENT&nbsp;</p>\n                                \n                                <p style="text-align:center">NEW NAME SUGGESTIONS&nbsp;</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                \n                                <p style="text-align:center">BRANDMATRIXTM OVERVIEW</p>\n                                \n                                <p>BrandMatrixTM is an online, interactive proprietary tool used to assist you in objectively selecting and ranking the name candidates for your new product. Team members confidentially select, rank, and evaluate their favorite name candidates. The BrandMatrixTM measures how well the name fits the product concept, overall likeability, and respondents&rsquo; comments, associations, or connotations.</p>\n                                \n                                <p>This report summarizes the BrandMatrixTM results providing a good assessment of favorable prospective names. The next step of the process will be a conference call to discuss the BrandMatrixTM results and identify the final name candidates to continue into the trademarks screening phase.</p>\n                                \n                                <p>&nbsp;</p>\n                                \n                                <p style="text-align:center">PROJECT BACKGROUND</p>\n                                \n                                <p>LEGEND</p>\n                                \n                                <p>The following names have been pre-screened for identical registered trademarks in the US Federal, US State, EUTM, WIPO and InterNIC registries. These name candidates appear free of prior registrations for services and products included in classes 5 and 10. This does not constitute Brand Institute&#39;s BrandSearchTM Intelligent Trademark Screening (IQ) or Full Legal Search.</p>\n                                \n                                <p>Please Note:</p>\n                                \n                                <p>(T) Denotes identical trademark registration</p>\n                                \n                                <p>(C) Denotes .com registration</p>\n                                \n                                <p>(CB) Denotes &quot;built-out&quot; .com website*</p>\n                                \n                                <p>(U/I) Denotes USAN/INN stem</p>\n                                \n                                <p>*The term &quot;built-out&quot; means that an actual website exists at this address and is not merely registered. Registered domain names are typically more obtainable than &quot;built-out&quot; websites.</p>\n                                \n                                <p>&nbsp;</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                \n                                <p style="text-align:center">BRANDMATRIXTM COMPLETION STATUS</p>\n                                \n                                <p style="text-align:center">This section details who participated in the BrandMatrixTM</p>\n                                \n                                <p style="text-align:center">Percentage of participants who have completed the BrandMatrixTM = 100%</p>\n                                \n                                <p style="text-align:center">(6 out of 6)</p>\n                                \n                                <p style="text-align:center">&nbsp;</p>\n                                ',
          componentSettings: [
            {
              fontSize: '16',
              fontFace: 'Arial',
              fontColor: 'red',
            },
          ],
        },
        {
          componentType: 'rate-scale',
          componentText: [
            {
              STARS: [
                {
                  id: 1,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 2,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 3,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 4,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 5,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
              ],
              nameCandidates: 'NameCandidates',
              ExtraColumn1: 'Email',
              ExtraColumn2: 'Status',
            },
            {
              STARS: [
                {
                  id: 1,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 2,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 3,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 4,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 5,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
              ],
              nameCandidates: 'Andrew Levin',
              ExtraColumn1: 'alevin@racap.com',
              ExtraColumn2: 'BM Completed',
            },
            {
              STARS: [
                {
                  id: 1,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 2,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 3,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 4,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 5,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
              ],
              nameCandidates: 'DA Gros',
              ExtraColumn1: 'dag@imbria.com',
              ExtraColumn2: 'BM Completed',
            },
            {
              STARS: [
                {
                  id: 1,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 2,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 3,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 4,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 5,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
              ],
              nameCandidates: 'Jai Patel',
              ExtraColumn1: 'jp@imbria.com',
              ExtraColumn2: 'BM Completed',
            },
            {
              STARS: [
                {
                  id: 1,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 2,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 3,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 4,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 5,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
              ],
              nameCandidates: 'Neil Buckley',
              ExtraColumn1: 'neil.buckley@carnotpharma.com',
              ExtraColumn2: 'BM Completed',
            },
            {
              STARS: [
                {
                  id: 1,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 2,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 3,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 4,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 5,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
              ],
              nameCandidates: 'Paul Chamberlain',
              ExtraColumn1: 'pc@imbria.com',
              ExtraColumn2: 'BM Completed',
            },
            {
              STARS: [
                {
                  id: 1,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 2,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 3,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 4,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
                {
                  id: 5,
                  icon: 'grade',
                  styleClass: 'rating-star',
                },
              ],
              nameCandidates: 'Rose Harrison',
              ExtraColumn1: 'rharrison@racap.com',
              ExtraColumn2: 'BM Completed',
            },
          ],
          componentSettings: [
            {
              minRule: 0,
              maxRule: 0,
              fontSize: 16,
              columnWidth: 308,
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
        },
        {
          componentType: 'text-editor',
          componentText:
            '<P style="text-align: center;font-size: 30px;color: #324395;">OVERALL RANKING BY TEST NAME</P>',
          componentSettings: [
            {
              fontSize: '16px',
              fontFace: 'Arial',
              fontColor: 'red',
            },
          ],
        },
        {
          componentType: 'rate-scale',
          componentText: [
            {
              rank: 'rank',
              nameCandidates: 'nameCandidates',
              score: 'score',
              comments: 'comments',
            },
            {
              rank: 1,
              nameCandidates: 'Test 2',
              score: 28,
              comments:
                '<div style="color: #ee7f25;">cvega1: <span style="color: #324395;">2dos comment</span></div>\n',
              Rank: 1,
            },
            {
              rank: 2,
              nameCandidates: 'Test 3',
              score: 20,
              comments: '',
            },
            {
              rank: 3,
              nameCandidates: 'Test 6',
              score: 19,
              comments:
                '<div style="color: #ee7f25;">cvega: <span style="color: #324395;">1 comment</span></div>\n<div style="color: #ee7f25;">cvega vega: <span style="color: #324395;">comment3</span></div>\n<div style="color: #ee7f25;">cvega1: <span style="color: #324395;">2 comment</span></div>\n',
            },
            {
              rank: 4,
              nameCandidates: 'Test 1',
              score: 16,
              comments:
                '<div style="color: #ee7f25;">cvega: <span style="color: #324395;">2nd commetn</span></div>\n',
            },
            {
              rank: 5,
              nameCandidates: 'Test 4',
              score: 14,
              comments: '',
            },
            {
              rank: 6,
              nameCandidates: 'Test 5',
              score: 12,
              comments: '',
            },
            {
              rank: 7,
              nameCandidates: 'Test 7',
              score: 3,
              comments: [null],
            },
          ],
          componentSettings: [
            {
              minRule: 0,
              maxRule: 4,
              fontSize: 16,
              columnWidth: 250,
              rationalewidth: 804,
              rowHeight: 2,
              categoryRulesPassed: false,
              ratedCounter: 0,
              categoryName: 'Name Candidates',
              categoryDescription: 'With Max Rate Amount',
              ratingScaleTitle: 'Rate from 1 to 7',
            },
          ],
        },
        {
          componentType: 'text-editor',
          componentText:
            '<P style="text-align: center;font-size: 30px;color: #324395;">VOTES BY RESPONDENT</P>',
          componentSettings: [
            {
              fontSize: '16px',
              fontFace: 'Arial',
              fontColor: 'red',
            },
          ],
        },
        {
          componentType: 'rate-scale',
          componentText: [
            {
              Rank: 'Rank',
              Score: 'Score',
              nameCandidates: 'Name Candidates',
              rationale: 'Rationale',
              Comments1: 'General Comments',
            },
            {
              Rank: 1,
              nameCandidates: 'Test 2',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 10,
            },
            {
              Rank: 2,
              nameCandidates: 'Test 6',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 8,
            },
            {
              Rank: 3,
              nameCandidates: 'Test 1',
              rationale:
                'Rationale of an unthRationale of an unthdddd dddddddd dddddddd ddddddddddd ddddddd dddddddd',
              Comments1: '1 comment',
              Score: 4,
            },
            {
              Rank: 4,
              nameCandidates: 'Test 4',
              rationale: 'Rationale of an losed length',
              Comments1: '2nd commetn',
              Score: 3,
            },
            {
              Rank: 5,
              nameCandidates: 'Test 5',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 2,
            },
            {
              Rank: 6,
              nameCandidates: 'Test 7',
              rationale:
                'Rationale of an unlosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed length',
              Comments1: '',
              Score: 1,
            },
            {
              Rank: 7,
              nameCandidates: 'Test 3',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 1,
            },
          ],
          componentSettings: [
            {
              minRule: 0,
              maxRule: 4,
              fontSize: 16,
              columnWidth: 150,
              rationalewidth: 204,
              rowHeight: 2,
              categoryRulesPassed: false,
              ratedCounter: 0,
              categoryName: 'cvega',
              categoryDescription: 'results by user sorted',
              ratingScaleTitle: 'Rate from 1 to 7',
            },
          ],
        },
        {
          componentType: 'rate-scale',
          componentText: [
            {
              Rank: 'Rank',
              Score: 'Score',
              nameCandidates: 'Name Candidates',
              rationale: 'Rationale',
              Comments1: 'General Comments',
            },
            {
              Rank: 1,
              nameCandidates: 'Test 3',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 10,
            },
            {
              Rank: 2,
              nameCandidates: 'Test 2',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 9,
            },
            {
              Rank: 3,
              nameCandidates: 'Test 4',
              rationale: 'Rationale of an losed length',
              Comments1: '',
              Score: 2,
            },
            {
              Rank: 4,
              nameCandidates: 'Test 1',
              rationale:
                'Rationale of an unthRationale of an unthdddd dddddddd dddddddd ddddddddddd ddddddd dddddddd',
              Comments1: 'comment3',
              Score: 2,
            },
            {
              Rank: 5,
              nameCandidates: 'Test 7',
              rationale:
                'Rationale of an unlosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed length',
              Comments1: '',
              Score: 1,
            },
            {
              Rank: 6,
              nameCandidates: 'Test 6',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 1,
            },
            {
              Rank: 7,
              nameCandidates: 'Test 5',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 1,
            },
          ],
          componentSettings: [
            {
              minRule: 0,
              maxRule: 4,
              fontSize: 16,
              columnWidth: 150,
              rationalewidth: 204,
              rowHeight: 2,
              categoryRulesPassed: false,
              ratedCounter: 0,
              categoryName: 'cvega vega',
              categoryDescription: 'results by user sorted',
              ratingScaleTitle: 'Rate from 1 to 7',
            },
          ],
        },
        {
          componentType: 'rate-scale',
          componentText: [
            {
              Rank: 'Rank',
              Score: 'Score',
              nameCandidates: 'Name Candidates',
              rationale: 'Rationale',
              Comments1: 'General Comments',
            },
            {
              Rank: 1,
              nameCandidates: 'Test 6',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 10,
            },
            {
              Rank: 2,
              nameCandidates: 'Test 1',
              rationale:
                'Rationale of an unthRationale of an unthdddd dddddddd dddddddd ddddddddddd ddddddd dddddddd',
              Comments1: '2 comment',
              Score: 10,
            },
            {
              Rank: 3,
              nameCandidates: 'Test 5',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 9,
            },
            {
              Rank: 4,
              nameCandidates: 'Test 4',
              rationale: 'Rationale of an losed length',
              Comments1: '',
              Score: 9,
            },
            {
              Rank: 5,
              nameCandidates: 'Test 3',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '2dos comment',
              Score: 9,
            },
            {
              Rank: 6,
              nameCandidates: 'Test 2',
              rationale: 'Rationale of an undisclosed length',
              Comments1: '',
              Score: 9,
            },
            {
              Rank: 7,
              nameCandidates: 'Test 7',
              rationale:
                'Rationale of an unlosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed lengthRationale of an undisclosed length',
              Comments1: '',
              Score: 1,
            },
          ],
          componentSettings: [
            {
              minRule: 0,
              maxRule: 4,
              fontSize: 16,
              columnWidth: 150,
              rationalewidth: 204,
              rowHeight: 2,
              categoryRulesPassed: false,
              ratedCounter: 0,
              categoryName: 'cvega1',
              categoryDescription: 'results by user sorted',
              ratingScaleTitle: 'Rate from 1 to 7',
            },
          ],
        },
      ],
    },
  ];
}
