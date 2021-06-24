import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
import { Nw3Service } from './nw3.service';
import { ActivatedRoute } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';

@Component({
  selector: 'app-nw3',
  templateUrl: './nw3.component.html',
  styleUrls: ['./nw3.component.scss']
})
export class NW3Component implements OnInit {
  HEROES: any[] = [
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    // { id: 19, name: 'Magma' },
    // { id: 20, name: 'Tornado' }
  ];
  // TESTING URLS
  // http://localhost:4200/HIRYU_test
  // https://bipresents.com/nwtest/HiRYU_test

  // https://bipresents.com/nw2/TEST_BI_Katakana

  // https://bipresents.com/namevote/login?project=TEST_BI_Katakana

  // https://bipresents.com/nw2/TEST_BI_Katakana_BigJap

  // https://bipresents.com/namevote/login?project=TEST_BI_Katakana_BigJap


  // https://bipresents.com/nw2/TEST_BI_Katakana_Phonetics

  // https://bipresents.com/namevote/login?project=TEST_BI_Katakana_Phonetics


  // https://bipresents.com/nw2/TEST_BI_Katakana_Tagline

  // https://bipresents.com/namevote/login?project=TEST_BI_Katakana_Tagline

  chartOption: any;
  fonts = ['coture', 'caviar', 'Chelsea', 'Gacor', 'NyataFTR', 'Pinkerston', 'Quicksand_Book', 'Quicksand_Light'
    , 'Cruncho', 'LilacBlockDemo', 'Medhurst', 'NewYork'];
  secodaryFontIndex = 0;
  font1 = this.fonts[1];
  font2 = this.fonts[0];
  font3 = this.fonts[1];
  font4 = this.fonts[1];
  elem: any;
  toogleFont = true;
  isFullscreen = false;
  mainMenu = true;
  fontIndexCounter = 0;
  isTableOfContent = false;
  isSettings = false;
  isGoVoteOn = false;
  hasSpeechBrowserSupport: boolean;
  myspeech = new Speech();


  slideNextPart = 'nw_slides/TEAM/thumbnails/001.jpg)';
  slideBackground = 'url(http://bipresents.com/nw2/';

  VotersList: any;
  votersBadge: any;
  nwPositiveVote: any;
  nwNegativeVote: any;
  nwNeutralVote: any;
  nwPositiveVoteUsers: any;
  nwNegativeVoteUsers: any;
  nwNeutralVoteUsers: any;
  projectData: any;
  // name: any ;
  projectName: any;
  // bsrProjectId: any;
  negativePronunciation = [];
  recraftChecked: any;

  slideModel: any = {
    'presentationid': '3157',
    'slideNumber': '1',
    'NameRanking': '',
    'NewNames': '',
    'NamesToExplore': '',
    'NamesToAvoid': '',
    'Direction': 'Next',
    'KanaNamesNegative': '',
    'recraft': '0',
  };

  go: boolean;
  GGClass = 'GG';
  newNameColor = 'warn';
  commentsColor = 'accent';
  // 3375,23,'Positive','','','','Next','',0


  // MENU VARS
  totalPages: number;
  keyboardDirection: number;
  switchButton: any;
  //  cantMoveForward: string;
  //  numberChanged: string;
  navigatePageInput: string;
  showTicker = new EventEmitter<string>();
  changePage = new EventEmitter<string>();
  //  currentSlideType = new EventEmitter<string>();
  reset = new EventEmitter<boolean>();
  showBackground = new EventEmitter<boolean>();
  hideBackgroundEmitter = new EventEmitter<boolean>();
  hideShowOverview = new EventEmitter<string>();
  tickeObj = {
    showingTicker: false,
    active: true
  };

  initialPage = 1;
  currentPage = this.initialPage;
  hideMenu = true;
  hideBackground = false;
  mute: boolean;
  nwVote = false;
  buttonOptionsObj;
  hideButton = true;
  isNonProp = true;
  showHelp = false;
  vote = true;

  stopMovingForward = false;
  overViewState = true;

  networkStatus: string;

  movingSlide = true;
  japanese: boolean;
  isKatakana_BigJap: boolean;
  nameCandidates: any[];
  groupName: any;
  showRankedNames: boolean;
  audiofile: any;
  fileToPlay: any;
  changePageNumber: any;
  groupNameType: any;
  // displayBackground: boolean;
  tempBackground: string;
  evaluationTimeElement: any;
  slideType: any;
  extraCommentsElement: any;
  totalPositive: any;
  totalNeutral: any;
  katakanaNames: any;
  BackgroundUrl: any;
  backgroundCounter: any;
  summarySlideMinWidth: number;
  rationaleMinWidth: number;
  separateCandidateElement: any;
  switchPosNegElement: any;
  groupRationale: any;
  rationale: any;
  category: any;
  positiveChecked = false;
  neutralChecked = false;
  negativeChecked = false;
  isPipeSplit: boolean;
  isGroupNameTooltip: boolean;
  summaryViewFlexLayout: string;
  cantMove: any;
  txtNewNameElement: any;
  pronunciationElement: any;
  @ViewChild('txtComments') txtCommentsElement: ElementRef;
  newNameFormField;
  commentsFormField;
  nameCandidateElement: any;
  pronunciationParentElement: any;
  hoverPositive: boolean;
  hoverNeutral: boolean;
  hoverNegative: boolean;
  VotersListOn: boolean;
  postRadio: boolean;
  isNewName: boolean;
  NeuRadio: boolean;
  NegRadio: boolean;
  // pageNumber: any;
  faVolumeUp: any;
  boxes: any;
  moving: boolean;
  wasClicked: any;
  listened: any;
  selectBackground: any;
  tempObj: any;
  tickerInterval: any;
  voteUsersInterval: any;
  slideChange: any;
  resetTime = false;
  auto = false;
  timer: any;
  interval;
  pieChart: any[];
  posCount: number;
  neuCount: number;
  negCount: number;
  hasBackground: boolean;
  totalNewNames: any[];
  tickerElement: any;
  // tickerTime: string;
  // @Input() currentSlidePageInfo = '';
  // @Input() projectId: string;
  imgBackground: any;
  slideImageElement: any;
  savePage: any;



  // DASH VARS 
  projectId: String = '';
  bsrProjectId: String = '';
  passTotalPages: number;
  name = '';
  tickerTime = '';
  presentationTime = false;
  results;
  changingPage = '';
  pageNumber = 1;
  currentProgress = this.pageNumber;
  cantMoveForward;
  isImage = true;
  isEvaluation = false;
  numberChanged = '';
  timeToReset = false;
  displayBackground = true;
  pageDirection = 0;
  contentResize = 90;
  overviewDisplay = true;
  thumbNails: any;
  navigatePageIndex;

  testName = 'Comirnaty';

  newNames = '';
  newComments = '';


  // GROUP NAMES TEMPLATE
  selectNameItemIndex;
  myleft: any;
  mytop: any;
  selectVoteIndex: any;
  groupTestNameFontSize: any;
  groupSlideHeihtValue: any;
  groupSlidelineHeightValue: string;
  cardWidthValue: any;
  rankIcon = [];
  rankIconsValue: any;
  rankIconsStyle: any;
  isFavoriteOn = false; slideNameBackground: string;


  // TALLY AND VOTE USER VARS
  displayVoteUserBadges = false;
  displayTallyButtons = false;
  positiveUsersVote: any = '';
  NeutralUsersVote: any = '';
  NegativeUsersVote: any = '';
  allVoters: any = '';
  displayPositiveBox = false;
  displayNeutralbox = false;
  displayNegativeBox = false;
  displayAllUsersBox = false;
  myAngularxQrCode: string;
  isQRcode = false;
  displayNameVoteMobiile = false;
  totalNegative: number;
  AditionalComments: any;

  // SUMMARY CHART VARS
  summaryPositive = false;
  summaryNeutral = false;
  summaryNegative = false;
  summaryNewNames = false;
  summaryChart = true;

  chartDimension = [700, 450];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Votes';
  showYAxisLabel = true;
  yAxisLabel = 'Names ';
  colorScheme = [
    {
      'name': 'Positive',
      'value': '#01bfa5'
    },
    {
      'name': 'Neutral',
      'value': '#ffdf00'
    },
    {
      'name': 'Negative',
      'value': '#fe0265'
    },
    {
      'name': 'New Names',
      'value': '#0237ff'
    }
  ];
  currentSlidePageInfo: string;
  previousSlideType: string;



  constructor(@Inject(DOCUMENT) private document: any,
    private _NW3Service: Nw3Service, private activatedRoute: ActivatedRoute,
    private _hotkeysService: HotkeysService) {

    this.activatedRoute.params.subscribe(params => {
      this.projectName = params['id'];
      localStorage.setItem('projectName', this.projectName);
      this._NW3Service.getProjectId(this.projectName).subscribe((data: any) => {
        this.projectId = data[0].PresentationId;
        localStorage.setItem('data', data[0].PresentationId);
      })
    });

    this._hotkeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {

      // but true to go through positive check
      if (this.stopMovingForward || this.vote) {
        this.selectPage('next');
      }
      return false;
    }, undefined, 'Move to next slide'));
    this._hotkeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
      // this.slideType = '';
      this.selectPage('previous');
      return false;
    }, undefined, 'Move to previous slide'));
    this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
      this.hideMenu = false;
      return false;
    }, undefined, 'Show menu'));
    this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
      this.hideMenu = true;
      return false;
    }, undefined, 'Hide menu'));
    this._hotkeysService.add(new Hotkey('o', (event: KeyboardEvent): boolean => {
      this.overViewState = (this.overViewState) ? false : true;
      // this.hideShowOverview.emit(this.overViewState + ',' + this.currentPage);
      return false;
    }, undefined, 'Hide/Show slide overview'));
    this._hotkeysService.add(new Hotkey('b', (event: KeyboardEvent): boolean => {
      // this.removeBackground();
      return false;
    }, undefined, 'Remove background'));
    this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {
      // this.timeToDisplayticker();
      return false;
    }, undefined, 'Show stock ticker'));
    this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
      // this.displayHelp(false);
      return false;
    }, undefined, 'Hide help sheet'));
    this._hotkeysService.add(new Hotkey('shift+r', (event: KeyboardEvent): boolean => {
      if (this.stopMovingForward  === false) {
        this.stopMovingForward  = true;
        this.vote = true;
      } else {
        this.stopMovingForward  = false;
      }
      return false;
    }, undefined, ''));
    this._hotkeysService.add(new Hotkey('1', (event: KeyboardEvent): boolean => {
      this.selectedOpt('Positive');
      // console.log('1 number key');
      return false;
    }, undefined, 'Set slide to positive'));
    this._hotkeysService.add(new Hotkey('2', (event: KeyboardEvent): boolean => {
      this.selectedOpt('Neutral');
      // console.log('2 number key');
      return false;
    }, undefined, 'Set slide to neutral'));
    this._hotkeysService.add(new Hotkey('3', (event: KeyboardEvent): boolean => {
      this.selectedOpt('Negative');
      // console.log('3 number key');
      return false;
    }, undefined, 'Set slide to negative'));
    this._hotkeysService.add(new Hotkey('4', (event: KeyboardEvent): boolean => {
      this.recraft();
      // console.log('3 number key');
      return false;
    }, undefined, 'Set slide to recraft'));

    // text to speech
    this.myspeech
      .init({
        volume: 0.5,
        lang: 'en-GB',
        rate: 1,
        pitch: 1,
        voice: 'Google French',
        splitSentences: false,
        listeners: {
          onvoiceschanged: voices => {
            console.log('Voices changed', voices);
          }
        }
      })
      .then(data => {
        console.log('Speech is ready', data);
        // this._addVoicesList(data.voices);
        // this._prepareSpeakButton(speech);
      })
      .catch(e => {
        // console.error('An error occured while initializing : ', e);
      });
    this.hasSpeechBrowserSupport = this.myspeech.hasBrowserSupport();

    // var scale = 'scale(1)';
    // document.body.style.webkitTransform = scale;    // Chrome, Opera, Safari
    // document.body.style.msTransform = scale;       // IE 9
    // document.body.style.transform = scale;
    document.body.style.zoom = 1.10;

  }

  ngOnInit(): void {
    this.changingPage = '{}';
    this.currentSlidePageInfo = this.changingPage;
    this.activatedRoute.params.subscribe((params: any) => {
      this.name = params.id;

      this._NW3Service.getProjectId(this.name).subscribe(
        (data: object) => {
          // console.log(JSON.parse(data));
          this.projectId = data[0].PresentationId;
          this.bsrProjectId = data[0].BSRPresentationid;
          this._NW3Service.getProjectData(this.projectId).subscribe(
            (data: string) => {
              console.log(data);
              this.results = JSON.stringify(data);
              this.switchButton = this.results;
              this.projectData = this.results;
              this.thumbNails = data;
              this.passTotalPages = data.length;
              this.totalPages = this.passTotalPages;
              this.changes();
            },
            err => console.log(err)
          );
        },
        err => console.log(err)
      );
    });


  }


  resetSlide(isReset) {
    this.timeToReset = isReset;
  }

  switchBackground(displayBg) {
    this.displayBackground = !displayBg;
  }

  cantMoveSlide(moveSlide: boolean) {
    this.cantMoveForward = moveSlide;
  }

  displayTicker(isDisplay: string) {
    if (JSON.parse(isDisplay).showingTicker) {
      this.tickerTime = isDisplay;
    } else {
      this.tickerTime = isDisplay;
    }
  }

  changes() {

    this.buttonOptionsObj = JSON.parse(this.switchButton);
    const projectData = JSON.parse(this.projectData);
    this.projectName = JSON.parse(this.projectData)[0].DisplayName;
    this.testName = projectData[this.pageNumber - 1].SlideDescription;

    //  FONTS INITIAL PARAMETERS FOR SLIDERS
    this.groupTestNameFontSize = (localStorage.getItem(this.projectName + '_groupTestNameFontSize')) ? localStorage.getItem(this.projectName + '_groupTestNameFontSize') : '50';
    this.groupSlideHeihtValue = (localStorage.getItem(this.projectName + '_groupSlideHeihtValue')) ? localStorage.getItem(this.projectName + '_groupSlideHeihtValue') : '5000';
    this.groupSlidelineHeightValue = (localStorage.getItem(this.projectName + '_groupSlidelineHeightValue')) ? localStorage.getItem(this.projectName + '_groupSlidelineHeightValue') : '10';

    //////////////////////////////////////////

    if (this.resetTime !== false) {
      this.positiveChecked = false;
      this.neutralChecked = false;
      this.negativeChecked = false;
      this.recraftChecked = false;
    } else {
      if (this.tickerTime !== '') {
        if (JSON.parse(this.tickerTime).active !== true) {
          const pageObj = JSON.parse(this.currentSlidePageInfo);
          if (pageObj.moveTo === 'summary') {
            this.savePage = this.pageNumber;
          }
        }
      } else {
        const pageObj = JSON.parse(this.currentSlidePageInfo);
        this.pageNumber = (this.currentSlidePageInfo !== '{}') ? pageObj.currentPage : this.pageNumber;
        this.slideType = projectData[this.pageNumber - 1].SlideType.trim();

        if (this.slideType !== 'Image') {

          this.testName = projectData[this.pageNumber - 1].SlideDescription;

          const lastVisitedPageNumber = (pageObj.moveTo === 'previous') ? this.pageNumber + 1 : this.pageNumber - 1;
          this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
        } else {
          setTimeout(() => {
            const bgImage = 'url(http://bipresents.com/nw2/' + projectData[this.pageNumber - 1].SlideBGFileName + ')';
            this.slideBackground = bgImage;
            // this.slideImageElement.nativeElement.style.backgroundImage = bgImage;
            // this.slideImageElement.nativeElement.style.backgroundSize = '100% 100%';
            const lastVisitedPageNumber = (pageObj.moveTo === 'previous') ? this.pageNumber + 1 : this.pageNumber - 1;
            this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
          }, 100);
        }
      }
    }


  }


  mouseEnter() {
    clearInterval(this.tickerInterval);
  }

  mouseLevae() {
    // this.startTicerInterval();
  }

  additionalComments(comments: string) {
    const note = comments.replace(/'/g, '`');
    this._NW3Service.saveNotes(this.projectId, note).subscribe(data => {
      console.log(data);
    });
  }



  // SUMMARY SLIDE DATA

  getSelectedRank(selectedRank) {
    this._NW3Service.getGroupSummary(this.projectId).subscribe(displayGroupResult => {
      this.nameCandidates = [];
      for (const obj of Object.values(displayGroupResult)) {
        this.tempObj = obj;
        let arrGroupRank;
        let arrGroupName;
        if (obj.name.includes('##')) {
          arrGroupRank = obj.nameranking.split('##');
          arrGroupName = obj.name.split('##');
        } else {
          arrGroupRank = obj.nameranking.split('##');
          arrGroupName = obj.name.split('$$');
        }
        arrGroupName.forEach((name, index) => {
          if (selectedRank === 'Positive' && arrGroupRank[index] === 'Positive') {
            this.nameCandidates.push({
              'NameToDisplay': name,
              'Name': this.tempObj.name
            });
          }
          if (selectedRank === 'Negative' && arrGroupRank[index] === 'Negative') {
            this.nameCandidates.push({
              'NameToDisplay': name,
              'Name': this.tempObj.name
            });
          }
          if (selectedRank === 'Neutral' && arrGroupRank[index] === 'Neutral') {
            this.nameCandidates.push({
              'NameToDisplay': name,
              'Name': this.tempObj.name
            });
          }
        });
      }
      if (selectedRank === 'New') {
        this.isNewName = true;
        this.postRadio = false;
        this.NeuRadio = false;
        this.NegRadio = false;
      } else if (selectedRank === 'Neutral') {
        this.isNewName = false;
        this.postRadio = false;
        this.NeuRadio = true;
        this.NegRadio = false;

      } else if (selectedRank === 'Negative') {
        this.isNewName = false;
        this.postRadio = false;
        this.NeuRadio = false;
        this.NegRadio = true;

      } else if (selectedRank === 'Positive') {
        this.isNewName = false;
        this.postRadio = true;
        this.NeuRadio = false;
        this.NegRadio = false;

      }
      this._NW3Service.getRetainTypeName(this.projectId, (selectedRank === "New Names") ? "New" : selectedRank).subscribe((data: Array<object>) => {
        if (this.nameCandidates.length === 0) {
          this.nameCandidates = data;
        } else {
          this.nameCandidates = this.nameCandidates.concat(data);
        }
        for (let i = 0; i < this.nameCandidates.length; i++) {
          this.nameCandidates[i].NameToDisplay = this.convertToEntities(this.nameCandidates[i].NameToDisplay);
        }
        this.showRankedNames = true;
      });
    });
  }

  selectPage(movingTo) {
    // stop moving slides for 300 miliseconds
    this.slideModel.Direction = movingTo;
    if (this.movingSlide) {
      this.movingSlide = false;
      let movePage = '';
      if (this.hideBackground) {
        this.hideBackground = !this.hideBackground;
      }
      if (movingTo === 'next') {
        if (this.currentPage >= this.totalPages) {
          this.currentPage = this.totalPages;
        } else {
          this.currentPage += 1;
          movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
          this.pageNumberChange(JSON.parse(movePage).currentPage);
        }
      } else if (movingTo === 'home') {
        this.currentPage = 1;

        movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
        this.pageNumberChange(JSON.parse(movePage).currentPage);

      } else if (movingTo === 'summary') {
        this.currentPage = this.totalPages;

        movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
        this.pageNumberChange(JSON.parse(movePage).currentPage);

      } else if (movingTo === 'previous') {
        if (this.currentPage <= this.initialPage) {
          this.currentPage = this.initialPage;

          movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
          this.pageNumberChange(JSON.parse(movePage).currentPage);

        } else {
          this.currentPage -= 1;

          movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
          this.pageNumberChange(JSON.parse(movePage).currentPage);

        }
      } else {
        movePage = '{"currentPage":' + this.currentPage + ', "moveTo":""}';
        this.pageNumberChange(JSON.parse(movePage).currentPage);

      }
      setTimeout(() => {
        this.movingSlide = true;
      }, 300);
    }
  }


  pageNumberChange(selectedPage) {
    this.pageNumber = Number(selectedPage);
    // this.pageNumber = 10;
    // PROGRESS BAR DATA
    this.currentProgress = (this.pageNumber / this.passTotalPages) * 100;
    if (selectedPage === this.passTotalPages) {
      this.changeSummaryList('chart');
    }

    clearInterval(this.voteUsersInterval);
    const pageObj = JSON.parse(this.currentSlidePageInfo);
    const projectData = JSON.parse(this.projectData);
    this.projectName = JSON.parse(this.projectData)[0].DisplayName;
    this.testName = projectData[this.pageNumber - 1].SlideDescription;
    this.pageNumber = (this.currentSlidePageInfo !== '{}') ? pageObj.currentPage : this.pageNumber;
    let lastVisitedPageNumber: any;
    this.previousSlideType = this.slideType;
    this.slideType = '';
    
    if (projectData[this.pageNumber - 1].SlideType.trim() === 'NameSummary') {
      this.slideType = 'NameSummary';
    }
    else if (projectData[this.pageNumber - 1].SlideType.trim() === 'Image') {
      this.slideType = 'Image';
      setTimeout(() => {
        const bgImage = 'url(http://bipresents.com/nw2/' + projectData[this.pageNumber - 1].SlideBGFileName + ')';
        this.slideBackground = bgImage;
        lastVisitedPageNumber = (pageObj.moveTo === 'previous') ? this.pageNumber + 1 : this.pageNumber - 1;
        this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
      }, 100);
    }

    if (this.slideModel.Direction === 'next') {
      this.slideModel.slideNumber = this.pageNumber - 1;
    } else if (this.slideModel.Direction === 'previous') {
      this.slideModel.slideNumber = this.pageNumber;
    }

    this.slideModel.presentationid = this.projectId;
    this.slideModel.NewNames = this.newNames;
    this.slideModel.NamesToExplore = this.newComments;

    // RESET NEW NAMES AND COMMENTS BOXES
    this.newNames = '';
    this.newComments = '';
    
    if (this.previousSlideType === 'MultipleNameEvaluation') {
      this.rankIcon.forEach(rankIcon => {
        if (rankIcon.icon === "favorite") {
          this.slideModel.NameRanking += 'positive' + '##';
        } else if (rankIcon.icon === "sentiment_very_satisfied") {
          this.slideModel.NameRanking += 'neutral' + '##';
        } else if (rankIcon.icon === "thumb_down_off_alt") {
          this.slideModel.NameRanking += 'negative' + '##';
        } else if (rankIcon.icon === "info") {
          this.slideModel.NameRanking += 'novalue' + '##';
        }
      });
    }

    if (this.positiveChecked) {
      this.slideModel.NameRanking = 'Positive'
    } else if (
      this.neutralChecked) {
        this.slideModel.NameRanking = 'Neutral'
    } else if (
      this.negativeChecked) {
        this.slideModel.NameRanking = 'Negative'
    }


      this.saveData(JSON.stringify(this.slideModel));
  }
  

  saveData(savingObj) {


    if (this.positiveChecked || this.neutralChecked || this.negativeChecked) {
      // this.slideModel.NameRanking = option;
    }

    const temp = JSON.parse(savingObj);
    temp.KanaNamesNegative = this.negativePronunciation.join(',');
    temp.recraft = (this.recraftChecked) ? 1 : 0;
    // savingObj = JSON.stringify(savingObj);
    this._NW3Service.getSaveNSlideInfo(savingObj).subscribe(
      data => {
        this.go = (data[0].presentationStatus === '0') ? true : false;

        this.slideModel.NameRanking = '';
       
          this.positiveChecked = false;
          this.neutralChecked = false;
          this.negativeChecked = false;

        // slideBackground = 'url(http://bipresents.com/nw2/' + this.slideNextPart;  slideNextPart = 'Test_WELL_PLATFORM/thumbnails/014.jpg)';
        if (data[0].NameRanking.toLowerCase() === 'positive') {
          this.positiveChecked = true;
          this.neutralChecked = false;
          this.negativeChecked = false;
        } else if (data[0].NameRanking.toLowerCase() === 'neutral') {
          this.neutralChecked = true;
          this.positiveChecked = false;
          this.negativeChecked = false;
        } else if (data[0].NameRanking.toLowerCase() === 'negative') {
          this.negativeChecked = true;
          this.positiveChecked = false;
          this.neutralChecked = false;
        } 
        this.newNames = data[0].NewNames;
        this.newComments = data[0].NamesToExplore;
        this.slideNextPart = data[0].SlideBGFileName;
        this.slideBackground = 'url(http://bipresents.com/nw2/';
        this.slideBackground = this.slideBackground + this.slideNextPart + ')';
        this.rankIcon = [];
        if (this.slideType === '') {
          if (data[0].GroupedNames.length > 0) {
            this.slideType = 'MultipleNameEvaluation';
            this.category = data[0].NameCategory;
            if (data[0].GroupedNames !== '') {
              if (data[0].GroupedNames.includes('##')) {
                this.groupName = data[0].GroupedNames.split('##');
                // this.groupName = "APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##LASTONE |(CT) (JB)|ベンポロ".split('##');
                // this.groupName = "APPOLOVENAPPOLOVENAPPOLOVENAPPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##VENPOLLO |(CT) (JB)|ベンポロ##APPOLOVEN|(J)|アポロベン##APPOVEN|(C)|アポベン##LUMVESTIN|(JB) (CTC)|ルムベスティン##ORAVEN|(CB)|オラベン##VENCHAI | (DE) (DEB)|ベンチャイ##VENLEPIUS | (U/I) (BR) (BRB)|ベンレピウス##LASTONE |(CT) (JB)|ベンポロ".split('##');
                this.rankIconsValue = data[0].NameRanking.split('##');
                // this.groupName.forEach(rankValue => {
                if (this.rankIconsValue[0] !== "") {
                  this.rankIconsValue.forEach(rankValue => {
                    if (rankValue.toLowerCase() === 'novalue') {
                      this.rankIcon.push({ icon: 'info', color: 'grey' });
                    } else if (rankValue.toLowerCase() === 'positive') {
                      this.rankIcon.push({ icon: 'favorite', color: 'red' });
                    } else if (rankValue.toLowerCase() === 'neutral') {
                      this.rankIcon.push({ icon: 'sentiment_very_satisfied', color: 'yellow' });
                    } else if (rankValue.toLowerCase() === 'negative') {
                      this.rankIcon.push({ icon: 'thumb_down_off_alt', color: 'purple' });
                    } else {
                      this.rankIcon.push({ icon: 'info', color: 'grey' });
                    }
                  });
                } else {
                  this.groupName.forEach(rankValue => {
                    this.rankIcon.push({ icon: 'info', color: 'grey' });
                  });
                }

                this.rankIconsStyle = [''];
                this.groupName.forEach(element => {
                  if (element.split('|').length > 1) {
                    this.isPipeSplit = true;
                  }

                });
                this.isGroupNameTooltip = true;
                // this.summaryViewFlexLayout = 'column wrap';
              } else {
                this.groupName = data[0].GroupedNames.split('$$');
                this.isGroupNameTooltip = false;
              }
            } else {
              this.name = data[0].Name;
              this.name = this.name.replace('(', '|(');
              if (this.evaluationTimeElement && data[0].TemplateFileName !== 'images/BackGrounds/Default.jpg') {
                // tslint:disable-next-line:max-line-length
                this.evaluationTimeElement.nativeElement.style.backgroundImage = this.BackgroundUrl + this.imgBackground[this.backgroundCounter] + '.jpg)';
                this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';
              }
            }

          } else {
            // this.slideNameBackground = 'url("https://image.shutterstock.com/shutterstock/photos/1897867054/display_1500/stock-vector-currency-watermark-background-intense-illustration-detailed-design-1897867054.jpg")';
            this.slideType = 'NameEvaluation';
            if (data[0].NameRanking === "") {
              this.vote = false;
            }
            else {
              this.vote = true;
            }
            this.voteUsersInterval = setInterval(() => {
              this.getNwVoteData();
            }, 500);
          }
        }
        this.setDataToDisplay(data, 'save');
        if (this.slideType === 'NameEvaluation') {
          this.category = data[0].NameCategory;
          this.rationale = data[0].NameRationale;
        }
      }
    );
    // this._NW3Service.saveSlideInformation(savingObj).subscribe(
    //   data => {
    //     // this.setDataToDisplay(data, 'save');
    //   }
    // );


    // this.slideType = 'info'; 

  }

  selectedOpt(option) {    
    if (option === 'Positive') {
      this.positiveChecked = !this.positiveChecked;
      this.neutralChecked = false;
      this.negativeChecked = false;
      // this.newNameColor = 'accent';
      // this.commentsColor = 'accent';
    }
    else if (option === 'Neutral') {
      this.neutralChecked = !this.neutralChecked;
      this.positiveChecked = false;
      this.negativeChecked = false;
      // this.newNameColor = 'primary';
      // this.commentsColor = 'primary';

    } else if (option === 'Negative') {
      this.neutralChecked = false;
      this.positiveChecked = false;
      this.negativeChecked = !this.negativeChecked;
    }

    if (this.neutralChecked === true
      ||this.positiveChecked === true
      ||this.negativeChecked === true) {
      this.vote = true;
    } else {
      this.vote = false;
    }

    if (this.japanese) {
      // this.faVolumeUp = null;
    }
  }

  moveRight() {
    if (this.stopMovingForward  || this.vote) {
        this.selectPage('next');
    }
  } 


  setDataToDisplay(data: any, comeFrom) {
    this.isNonProp = (data[0].PresentationType === 'Nonproprietary') ? true : false;
    this.japanese = (data[0].PresentationType === 'Katakana') ? true : false;
    this.isKatakana_BigJap = (data[0].PresentationType === 'Katakana_BigJap') ? true : false;
    this.recraftChecked = (data[0].Recraft === "False") ? false : true;
    if (this.isKatakana_BigJap) {
      this.japanese = true;
    }
    localStorage.setItem('isNonProp', this.isNonProp.toString());
    localStorage.setItem('isKatakana', this.japanese.toString());
    this.nameCandidates = [];
    // this.groupName = '';
    this.showRankedNames = false;
    if (data[0].mp3FilePath) {
      this.audiofile = data[0].mp3FilePath;
      this.fileToPlay = data[0].mp3FilePath;
      const audio = new Audio();
      audio.src = this.fileToPlay;
      audio.load();
      if (!this.mute) {
        audio.play();
      }
    } else {
      this.fileToPlay = '';
    }

    if (comeFrom === 'clicked_name') {
      const sendSlideNumber = data[0].SlideNumber;
      this.changePageNumber.emit(sendSlideNumber);
    }

    if (data[0].TemplateFileName !== '' && data[0].TemplateFileName !== 'images/BackGrounds/Default.jpg') {
      setTimeout(() => {
        this.groupNameType = data[0].GroupedNames.length;
        if (this.displayBackground === false) {
          this.tempBackground = 'url(http://bipresents.com/nw2/assets/' + data[0].TemplateFileName + ')';
          // tslint:disable-next-line:max-line-length
          this.evaluationTimeElement.nativeElement.style.backgroundImage = this.BackgroundUrl + this.hideBackground[this.backgroundCounter] + '.jpg)';
          this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';
        } else {
          if (this.evaluationTimeElement) {
            if ('url(http://bipresents.com/nw2/' + data[0].TemplateFileName + ')' !== this.tempBackground) {

              if (this.groupNameType !== 0) {
                this.evaluationTimeElement.nativeElement.style.backgroundImage = '';
                this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';

              } else {
                this.evaluationTimeElement.nativeElement.style.backgroundImage = this.BackgroundUrl + data[0].TemplateFileName + ')';
                this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';
                this.evaluationTimeElement.nativeElement.style.backgroundRepeat = 'no-repeat';
                this.tempBackground = 'url(http://bipresents.com/nw2/assets/' + data[0].TemplateFileName + ')';
              }
            } else {

              if (this.groupNameType !== 0) {
                this.evaluationTimeElement.nativeElement.style.backgroundImage = '';
                this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';

              } else {
                this.evaluationTimeElement.nativeElement.style.backgroundImage = this.tempBackground;
                this.groupNameType = data[0].GroupedNames.length;
              }
            }
          }


        }
      }, 50);
    }

    if (this.slideType === 'NameSummary') {
      this._NW3Service.getNotes(this.projectId).subscribe(note => {
        this.AditionalComments = note[0].NotesExplore.replace(/`/g, '\'');
      });
    }

    this.totalPositive = (data[0].TotPositive != 0) ? data[0].TotPositive = 1 : '';
    this.totalNeutral = (data[0].TotNeutral != 0) ? data[0].TotNeutral = 1 : '';

    this.negativePronunciation = [];
    if (this.japanese) {
      this.katakanaNames = data[0].KanaNames.replace(/`/g, '\'').split('、');
    }
    else {
      this.katakanaNames = data[0].KanaNames.replace(/`/g, '\'').split(',');
    }

    if (this.katakanaNames[0].length >= 1) {
      // this.faVolumeUp = faVolumeUp;
    } else {
      // this.faVolumeUp = null;
    }

    if (data[0].GroupRationale !== '') {
      if (data[0].GroupRationale.includes('##')) {
        this.groupRationale = data[0].GroupRationale.replace(/`/g, '\'').split('##');
      } else {
        this.groupRationale = data[0].GroupRationale.replace(/`/g, '\'').split('$$');
      }
    } else {
      this.rationale = data[0].NameRationale.replace(/`/g, '\'');
      this.groupRationale = '';
    }

    this.category = data[0].NameCategory;
    // if (data[0].GroupedNames === '') {
    //   if (data[0].NameRanking === 'Positive') {
    //     setTimeout(() => {
    //       this.positiveChecked = false;
    //       this.neutralChecked = false;
    //       this.negativeChecked = false;
    //       this.selectedOpt(data[0].NameRanking.toLowerCase());
    //     }, 10);
    //   } else if (data[0].NameRanking === 'Neutral') {
    //     setTimeout(() => {
    //       this.positiveChecked = false;
    //       this.neutralChecked = false;
    //       this.negativeChecked = false;
    //       this.selectedOpt(data[0].NameRanking.toLowerCase());
    //     }, 10);
    //   } else if (data[0].NameRanking === 'Negative') {
    //     setTimeout(() => {
    //       this.positiveChecked = false;
    //       this.neutralChecked = false;
    //       this.negativeChecked = false;
    //       this.selectedOpt(data[0].NameRanking.toLowerCase());
    //     }, 10);
    //   } else {
    //     if (data[0].SlideType === 'NameEvaluation') {
    //       // this.cantMove.emit(true);
    //     }
    //     this.selectedOpt(data[0].NameRanking.toLowerCase());
    //   }
    // } else {
    //   // this.cantMove.emit(false);
    // }

    if (this.txtNewNameElement) {
      const tstr = this.convertToEntities(data[0].NewNames);
      this.txtNewNameElement.nativeElement.value = tstr;
    }
    if (this.txtCommentsElement) {
      const tstr = this.convertToEntities(data[0].NamesToExplore);
      this.txtCommentsElement.nativeElement.value = tstr;
    }

    if (data[0].KanaNamesNegative !== '') {
      const tstr = this.convertToEntities(data[0].KanaNamesNegative);
      data[0].KanaNamesNegative = tstr;
      setTimeout(() => {
        this.slideModel.KanaNamesNegative = data[0].KanaNamesNegative.split(',');
        this.pronunciationElement.toArray().forEach(element => {
          const idx = this.slideModel.KanaNamesNegative.indexOf(element.nativeElement.innerText);
          if (idx > -1) {
            element.nativeElement.style.color = 'red';
          } else {
            element.nativeElement.style.color = 'black';
          }
        });
      }, 50);
    } else {
      this.slideModel.KanaNamesNegative = [];
    }

    if (this.backgroundCounter >= 9) {
      this.backgroundCounter = 0;
    } else {
      this.backgroundCounter++;
    }

  }

  
  //  Businness logic 

  recraft() {
    // alert("Hello! I am an alert box!!");
    this.recraftChecked = !this.recraftChecked;
  }

  negativeName(event, filesrc) {
    if (this.japanese) {
      this.faVolumeUp = null;
      const negKanaIndex = this.negativePronunciation.indexOf(event.currentTarget.innerText);
      if (event.currentTarget.style.color === 'red') {
        this.negativePronunciation.splice(negKanaIndex, 1);
        event.currentTarget.style.color = 'black';
      } else {
        this.negativePronunciation.push(event.currentTarget.innerText);
        event.currentTarget.style.color = 'red';
        // event.currentTarget.style.color = 'red';
      }
    } else {
      // Speech OFF
      //this.speech(this.myspeech, event.currentTarget.innerText);
      const audio = new Audio();
      audio.src = this.fileToPlay;
      audio.load();
      if (!this.mute) {
        audio.play();
      }

      // this.faVolumeUp = faVolumeUp;
    }
  }

  moveLeft() {
    this.moving = true;
    setTimeout(() => {
      this.switchFirst();
    }, 1000);
  }

  switchFirst() {
    this.boxes.push(this.boxes.shift());
    this.moving = false;
  }

  listenChild() {
    if (!this.wasClicked) {
      this.wasClicked = true;
      this.listened.emit(this.wasClicked);
    } else {
      this.wasClicked = false;
      this.listened.emit(this.wasClicked);
    }
  }

  changeBackground(event) {
    if (event.currentTarget.id === 'btnPositive') {
      this.selectBackground.emit('positiveBackground');
    } else if (event.currentTarget.id === 'btnNeutral') {
      this.selectBackground.emit('neutralBackground');
    } else {
      this.selectBackground.emit('negativeBackground');
    }
  }


  setEvaluationData(previousNumber, direction) {
    let selectedRank;

    if (this.groupName === '') {
      if (this.positiveChecked) {
        selectedRank = 'Positive';
      } else if (this.neutralChecked) {
        selectedRank = 'Neutral';
      } else if (this.negativeChecked) {
        selectedRank = 'Negative';
      } else {
        selectedRank = '';
      }

      this.slideModel.NameRanking = selectedRank;
    }
    this.slideModel.presentationid = this.projectId;
    this.slideModel.slideNumber = previousNumber;
    let strPronunciation = '';
    if (this.negativePronunciation.join(',').indexOf('\'') >= 0) {
      strPronunciation = this.negativePronunciation.join(',').replace(/'/g, '\'\'');
    } else {
      strPronunciation = this.negativePronunciation.join(',');
    }

    if (strPronunciation !== '') {
      this.slideModel.KanaNamesNegative = strPronunciation;
    } else {
      if (this.slideModel.KanaNamesNegative !== '') {
        if (this.slideModel.KanaNamesNegative.join(',').indexOf('\'') >= 0) {
          strPronunciation = this.slideModel.KanaNamesNegative.join(',').replace(/'/g, '\'\'');
        } else {
          strPronunciation = this.slideModel.KanaNamesNegative.join(',');
        }
        this.slideModel.KanaNamesNegative = strPronunciation;
      }
    }

    if (direction === 'next') {
      this.slideModel.Direction = 'Next';
      this.saveData(JSON.stringify(this.slideModel));
    }
    if (direction === 'previous') {
      this.slideModel.slideNumber + 1;
      this.slideModel.Direction = 'Prev';
      this.saveData(JSON.stringify(this.slideModel));
    }
    if (direction === 'home') {
      this.slideModel.Direction = 'Next';
      this.slideModel.slideNumber = 1;
      this.saveData(JSON.stringify(this.slideModel));
    }
    if (direction === 'summary') {
      this.slideModel.Direction = 'Next';
      this.saveData(JSON.stringify(this.slideModel));
      setTimeout(() => {
        this.slideModel.slideNumber = JSON.parse(this.projectData).length;
        this.saveData(JSON.stringify(this.slideModel));
        this.isNewName = false;
        this.postRadio = false;
        this.NeuRadio = false;
        this.NegRadio = false;
      }, 50);
    }
    if (direction === '') {
      this.slideModel.slideNumber = this.pageNumber;
      this.slideModel.Direction = '';
      this.saveData(JSON.stringify(this.slideModel));
    }
  }

  selectAll() {
    this.separateCandidateElement.toArray().forEach(element => {
      if (this.switchPosNegElement.nativeElement.checked) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
  }


  goVote() {
    this.isGoVoteOn = !this.isGoVoteOn;
  }

  noClickanyWhere() {
    this.hoverPositive = false;
    this.hoverNeutral = false;
    this.hoverNegative = false;
    this.VotersListOn = false;
    this.displayNameVoteMobiile = false;
    this.isQRcode = false;
  }

  mouseLeaveVote() {
    setTimeout(() => {
      this.hoverPositive = false;
    }, 300);
  }

  // Configuration methods

  speech(speech, textToSpeech) {
    if (this.hasSpeechBrowserSupport) {
      speech
        .speak({
          text: textToSpeech,
          queue: false,
          listeners: {
            onstart: () => {
              console.log('Start utterance');
            },
            onend: () => {
              console.log('End utterance');
            },
            onresume: () => {
              console.log('Resume utterance');
            },
            onboundary: event => {
              console.log(
                event.name +
                ' boundary reached after ' +
                event.elapsedTime +
                ' milliseconds.'
              );
            }
          }
        })
        .then(data => {
          console.log('Success !', data);
        })
        .catch(e => {
          console.error('An error occurred :', e);
        });
    } else {
      console.log('The browser do not support text to speech');
    }
  }

  fontTheme() {
    this.toogleFont = !this.toogleFont;
    this.font2 = this.fonts[this.fontIndexCounter];
    if (this.fontIndexCounter === 7) {
      this.fontIndexCounter = 0;
    } else {

      this.fontIndexCounter++;
    }
  }


  toogleMenu() {
    this.mainMenu = !this.mainMenu;
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
    }
    else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      }
      else if (this.document.mozCancelFullScreen) {
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

  //  NEW CODE 02/18/21

  moveLeft1() {
    if (true) {
      // this.slideType = '';
      this.selectPage('previous');
    }
  }

  


  // areAllLike(arr) {
  //   for (let i = 0; i < arr.length; i++) {
  //     if (arr[i] !== 'Positive') {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  convertToEntities(str) {
    let bstr = '';
    if (str.length !== 0 && (this.japanese.toString() === 'true') ? true : false) {
      const tstr = str.split(';');
      for (let i = 0; i < tstr.length - 1; i++) {
        bstr += String.fromCharCode(tstr[i].replace('&#', ''));
      }
    } else {
      return str;
    }
    return bstr;
  }

  play() {
    const audio = new Audio();
    audio.src = this.audiofile;
    audio.load();
    if (!this.mute) {
      audio.play();
    }
  }

  // GO BUTON SIGNAL FOR VOTE MOBILE APP
  sendNameToMobileNW() {
    // this.go = !this.go;
    this._NW3Service.sendGoSignalVoting(
      JSON.parse(this.projectData)[0].DisplayName, this.go).subscribe(res => {
        console.log(res);

      })
  }

  deleteParticipant(participant: string) {
    if (confirm("Are sure you would like to delete " + participant + '?')) {
      this._NW3Service.DeleteUserFromProject(this.projectName, participant).subscribe(res => {

      });
      console.log("Implemented delete functionality here ");
    }

  }

  // SUMMARY CHART FUNCTIONS

  onChartClick(e) {
    console.log(e);
    this.changeSummaryList(e.name.toLowerCase())
  }


  changeSummaryList(listSelection) {

    if (listSelection === 'positive') {
      this.summaryPositive = true;
      this.summaryNeutral = false;
      this.summaryNegative = false;
      this.summaryNewNames = false;
      this.summaryChart = false;
    }

    else if (listSelection === 'neutral') {
      this.summaryPositive = false;
      this.summaryNeutral = true;
      this.summaryNegative = false;
      this.summaryNewNames = false;
      this.summaryChart = false;
    }

    else if (listSelection === 'negative') {
      this.summaryPositive = false;
      this.summaryNeutral = false;
      this.summaryNegative = true;
      this.summaryNewNames = false;
      this.summaryChart = false;
    }

    else if (listSelection === 'new names') {
      this.summaryPositive = false;
      this.summaryNeutral = false;
      this.summaryNegative = false;
      this.summaryNewNames = true;
      this.summaryChart = false;
    }

    else if (listSelection === 'chart') {
      this.summaryPositive = false;
      this.summaryNeutral = false;
      this.summaryNegative = false;
      this.summaryNewNames = false;
      this.summaryChart = true;
    }

    this.pieChart = [];
    const newChartData = [];
    this._NW3Service.getGroupSummary(this.projectId).subscribe(groupResult => {
      this.posCount = 0;
      this.neuCount = 0;
      this.negCount = 0;
      for (const obj of Object.values(groupResult)) {
        const arrRanks = obj.nameranking.split('##');

        arrRanks.forEach(rank => {
          if (rank === 'Positive') {
            this.posCount++;
          } else if (rank === 'Neutral') {
            this.neuCount++;
          } else if (rank === 'Negative') {
            this.negCount++;
          }
        });

        if (arrRanks.length > 0) {
          this.hasBackground = false;
        }
      }
      this.totalNewNames = [];
      this._NW3Service.getRetainTypeName(this.projectId, "New").subscribe((data: Array<object>) => {
        data.forEach(ele => {
          this.totalNewNames.push(ele);
        });

        this._NW3Service.getRetainTypeName(this.projectId, 'Positive').subscribe((resultPos: Array<object>) => {
          this.totalPositive = resultPos.length + this.posCount;
          newChartData.push({
            'name': 'Positive',
            'value': resultPos.length + this.posCount
          });
          resultPos.forEach((element: any) => {
            element.NewNames.split(',').forEach(ele => {
              if (ele !== '') {
              }
            });;
          });

          this._NW3Service.getRetainTypeName(this.projectId, 'Neutral').subscribe((resultNeu: Array<object>) => {
            this.totalNeutral = resultNeu.length + this.neuCount;
            newChartData.push({
              'name': 'Neutral',
              'value': resultNeu.length + this.neuCount
            });

            this._NW3Service.getRetainTypeName(this.projectId, 'Negative').subscribe((resultNeg: Array<object>) => {
              this.totalNegative = resultNeg.length + this.negCount;
              newChartData.push({
                'name': 'Negative',
                'value': resultNeg.length + this.negCount
              });

              newChartData.push({
                'name': 'New Names',
                'value': this.totalNewNames.length
              });

              const resArr = [];
              newChartData.forEach(function (item) {
                const i = resArr.findIndex(x => x.name === item.name);
                if (i <= -1) {
                  resArr.push({ name: item.name, value: item.value });
                }
              }, this.pieChart = resArr);
            });
          });
        });
      });
    });
  }


  // GROUP NAMES TEMPLATE SETTINGS

  selectetdNameIndex(i, event) {
    this.selectNameItemIndex = i;
    this.myleft = event.clientX;
    this.mytop = event.clientY;
  }

  // selectetVotedIndex(i, event) {
  //   this.selectVoteIndex = i;
  //   this.myleft = event.clientX;
  //   this.mytop = event.clientY;
  // }


  setFontSize(groupTestNameFontSize) {
    this.groupTestNameFontSize = groupTestNameFontSize;
    localStorage.setItem(this.projectName + '_groupTestNameFontSize', this.groupTestNameFontSize.toString());
  }

  setGroupSlideHeight(groupSlideHeiht) {
    this.groupSlideHeihtValue = groupSlideHeiht;
    localStorage.setItem(this.projectName + '_groupSlideHeihtValue', this.groupSlideHeihtValue.toString());
  }

  setGroupSlidelineHeight(groupSlidelineHeight) {
    this.groupSlidelineHeightValue = groupSlidelineHeight;
    localStorage.setItem(this.projectName + '_groupSlidelineHeightValue', this.groupSlidelineHeightValue.toString());
  }

  toggleRankIcon(rankIcon, i) {
    if (rankIcon[i].icon === 'info') {
      this.rankIcon[i] = { icon: 'favorite', color: 'red' };
    } else if (rankIcon[i].icon === 'favorite') {
      this.rankIcon[i] = { icon: 'sentiment_very_satisfied', color: '#ffad37' }
    } else if (rankIcon[i].icon === 'sentiment_very_satisfied') {
      this.rankIcon[i] = { icon: 'thumb_down_off_alt', color: 'purple' };
    } else if (rankIcon[i].icon === 'thumb_down_off_alt') {
      this.rankIcon[i] = { icon: 'info', color: 'grey' };
    }
  }

  setAllNamesIcon(icon, color) {
    this.isFavoriteOn = !this.isFavoriteOn;
    this.rankIcon.forEach(currenticon => {
      currenticon.icon = icon;
      currenticon.color = color;
    });

  }


  // VOTE USERS BADGES AND FUNCTIONS


  getNwVoteData() {
    // this.go = !this.go;
    this._NW3Service.getNwVoteData(this.projectName, this.testName).subscribe(res => {
      const data = JSON.parse(res.d);
      this.VotersList = data.VotersList;
      this.votersBadge = data.VotersList.length;
      this.nwPositiveVote = data.Positive;
      this.nwNegativeVote = data.Negative;
      this.nwNeutralVote = data.Neutral;

      this.nwPositiveVoteUsers = data.PositiveVoters
      this.nwNeutralVoteUsers = data.NeutralVoters;
      this.nwNegativeVoteUsers = data.NegativeVoters;
    })
  }

  voteUserBadges() {
    this.displayVoteUserBadges = !this.displayVoteUserBadges;
    if (this.displayVoteUserBadges) {
      this.positiveUsersVote = this.nwPositiveVote;
      this.NeutralUsersVote = this.nwNeutralVote;
      this.NegativeUsersVote = this.nwNegativeVote;
      this.allVoters = this.nwPositiveVote + this.nwNeutralVote + this.nwNegativeVote;

    } else {
      this.positiveUsersVote = '';
      this.NeutralUsersVote = '';
      this.NegativeUsersVote = '';
      this.allVoters = '';
    }
  }

  displayTally() {
    this.displayTallyButtons = !this.displayTallyButtons;
  }

  displayOverviewBox(boxType) {

    if (this.displayVoteUserBadges) {

      if (boxType === 'positiveBox') {

        this.displayPositiveBox = true;


      } else if (boxType === 'neutralBox') {

        this.displayNeutralbox = true;

      } else if (boxType === 'negativeBox') {

        this.displayNegativeBox = true;

      } else if (boxType === 'allUsersBox') {

        this.displayAllUsersBox = true;

      }

    }

  }

  displayQRCode() {
    this.isQRcode = !this.isQRcode;
    this.myAngularxQrCode = ' www.mynamepage.com/' + 'PROJECTS';
  }

  displayNameVoteInfo() {
    this.displayNameVoteMobiile = !this.displayNameVoteMobiile;
  }

  deleteVoteUser(i) {
    console.log(i);

  }

  clickedSummaryName(clickedName, originalName) {
    let searchName = clickedName;
    if (originalName) {
      searchName = originalName;
    }
    this._NW3Service.getSelectedName(this.projectId, searchName).subscribe(data => {
      this.setDataToDisplay(data, 'clicked_name');
    });
  }

}

 // DASH CODE

  // resizeContent() {
  //   if (window.innerWidth >= 1900) {
  //     this.contentResize = 60;
  //   } else if (window.innerWidth >= 1700) {
  //     this.contentResize = 55;
  //   } else if (window.innerWidth >= 1400) {
  //     this.contentResize = 60;
  //   } else if (window.innerWidth >= 1024) {
  //     this.contentResize = 80;
  //   } else {
  //     this.contentResize = 90;
  //   }
  // }

  // moveSlideDirection(e) {
  //   this.pageDirection = e;
  // }

  // currentSlideType(slideType) {
  //   if (slideType === 'NameEvaluation') {
  //     this.isImage = false;
  //     this.isEvaluation = true;
  //   }
  //   if (slideType === 'Image' || slideType === 'NameSummary') {
  //     this.isImage = true;
  //     this.isEvaluation = false;
  //   }
  // }


     // this.newNameFormField = <HTMLInputElement>document.getElementById('newNameFormField');
    // this.commentsFormField = <HTMLInputElement>document.getElementById('commentsFormField');
    // if (this.newNameFormField) {
    //   this.newNameFormField.style.marginTop = '-30px';
    // }
    // if (this.commentsFormField) {
    //   this.commentsFormField.style.marginTop = '-30px';
    // }

      // setNewNameElement(setColor) {
  //   this.newNameFormField.getElementsByClassName('mat-form-field-outline')[0].style.color = setColor;
  //   this.newNameFormField.getElementsByClassName('mat-form-field-outline')[1].style.color = setColor;
  //   this.newNameFormField.getElementsByClassName('mat-form-field-label')[0].style.color = setColor;
  // }

  // setCommentsElement(setColor) {
  //   this.commentsFormField.getElementsByClassName('mat-form-field-outline')[0].style.color = setColor;
  //   this.commentsFormField.getElementsByClassName('mat-form-field-outline')[1].style.color = setColor;
  //   this.commentsFormField.getElementsByClassName('mat-form-field-label')[0].style.color = setColor;
  // }

    // this.testName = projectData[this.pageNumber - 1].SlideDescription;

    // if (this.slideType !== 'Image') {
    //   if (pageObj.moveTo === 'previous') {
    //     lastVisitedPageNumber = this.pageNumber + 1;
    //   }
    //   if (pageObj.moveTo === 'next') {
    //     lastVisitedPageNumber = this.pageNumber - 1;
    //   }
    //   if (pageObj.moveTo === 'summary') {
    //     lastVisitedPageNumber = this.savePage;


    //   }
    //   this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
    // }


  // showPieChart() {
  //   this.showRankedNames = false;
  //   this.isNewName = false;
  //   this.postRadio = false;
  //   this.NeuRadio = false;
  //   this.NegRadio = false;
  // }

  // onSelect(clickEvent) {
  //   this.getSelectedRank(clickEvent.name);
  // }

 // collectGroupRanks() {
  //   this.slideModel.NameRanking = '';
  //   if (this.separateCandidateElement) {
  //     this.separateCandidateElement.toArray().forEach((element, index) => {
  //       if (element.checked) {
  //         if (index === (this.separateCandidateElement.toArray().length - 1)) {
  //           this.slideModel.NameRanking = this.slideModel.NameRanking + 'Positive';
  //         } else {
  //           this.slideModel.NameRanking = this.slideModel.NameRanking + 'Positive##';
  //         }
  //       } else {
  //         if (index === (this.separateCandidateElement.toArray().length - 1)) {
  //           this.slideModel.NameRanking = this.slideModel.NameRanking + 'Negative';
  //         } else {
  //           this.slideModel.NameRanking = this.slideModel.NameRanking + 'Negative##';
  //         }
  //       }
  //     });
  //   }
  // }

  // startTicerInterval() {
  //   this.tickerInterval = setInterval(() => {
  //     this.moveLeft();
  //   }, 2000);
  // }

  // moveSlide(e) {
  //   if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 40 || e.keyCode === 38) {
  //     this.slideChange.emit(e.keyCode);
  //   }
  // }
 // this.pageNumber = (this.currentSlidePageInfo !== '{}') ? pageObj.currentPage : this.pageNumber;
          // this.slideType = projectData[this.pageNumber - 1].SlideType.trim();


          // // this.testName = projectData[this.pageNumber - 1].SlideDescription;

          // if (this.slideType !== 'Image') {
          //   if (pageObj.moveTo === 'previous') {
          //     lastVisitedPageNumber = this.pageNumber + 1;
          //   }
          //   if (pageObj.moveTo === 'next') {
          //     lastVisitedPageNumber = this.pageNumber - 1;
          //   }
          //   if (pageObj.moveTo === 'summary') {
          //     lastVisitedPageNumber = this.savePage;
          //   }
          //   this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
          // } else {
          //   setTimeout(() => {
          //     const bgImage = 'url(http://bipresents.com/nw2/' + projectData[this.pageNumber - 1].SlideBGFileName + ')';
          //     this.slideBackground = bgImage;
          //     // this.slideImageElement.nativeElement.style.backgroundImage = bgImage;
          //     // this.slideImageElement.nativeElement.style.backgroundSize = '100% 100%';
          //     lastVisitedPageNumber = (pageObj.moveTo === 'previous') ? this.pageNumber + 1 : this.pageNumber - 1;
          //     this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
          //   }, 100);
          // }

           // if (this.auto) {
    //   let time = this.timer;
    //   this.interval = setInterval(() => {
    //     console.log(time);
    //     time--;
    //     if (time < 0) {
    //       this.slideChange.emit(39);
    //       clearInterval(this.interval);
    //       console.log('Ding!');
    //     };
    //   }, 1000);
    // }
    // this.slideModel.NamesToExplore = (this.txtCommentsElement) ? this.txtCommentsElement.nativeElement.value : '';
    // this.slideModel.NewNames = (this.txtNewNameElement) ? this.txtNewNameElement.nativeElement.value : '';

    // this.pieChart = [];
    // const newChartData = [];
    // this._NW3Service.getGroupSummary(this.projectId).subscribe(groupResult => {
    //   this.posCount = 0;
    //   this.neuCount = 0;
    //   this.negCount = 0;
    //   for (const obj of Object.values(groupResult)) {
    //     const arrRanks = obj.nameranking.split('##');

    //     arrRanks.forEach(rank => {
    //       if (rank === 'Positive') {
    //         this.posCount++;
    //       } else if (rank === 'Neutral') {
    //         this.neuCount++;
    //       } else if (rank === 'Negative') {
    //         this.negCount++;
    //       }
    //     });

    //     if (arrRanks.length > 0) {
    //       this.hasBackground = false;
    //     }
    //   }
    //   this.totalNewNames = [];
    //   this._NW3Service.getRetainTypeName(this.projectId, 'Positive').subscribe((resultPos: Array<object>) => {
    //     this.totalPositive = resultPos.length + this.posCount;
    //     newChartData.push({
    //       'name': 'Positive',
    //       'value': resultPos.length + this.posCount
    //     });
    //     resultPos.forEach((element: any) => {
    //       element.NewNames.split(',').forEach(ele => {
    //         if (ele !== '') {

    //         }
    //       });;
    //     });

    //     this._NW3Service.getRetainTypeName(this.projectId, "New").subscribe((data: Array<object>) => {
    //       data.forEach(ele => {
    //         this.totalNewNames.push(ele);
    //       });;
    //       ;
    //     });


    //     this._NW3Service.getRetainTypeName(this.projectId, 'Neutral').subscribe((resultNeu: Array<object>) => {
    //       this.totalNeutral = resultNeu.length + this.neuCount;
    //       newChartData.push({
    //         'name': 'Neutral',
    //         'value': resultNeu.length + this.neuCount
    //       });
    //       this._NW3Service.getRetainTypeName(this.projectId, 'Negative').subscribe((resultNeg: Array<object>) => {
    //         newChartData.push({
    //           'name': 'Negative',
    //           'value': resultNeg.length + this.negCount
    //         });

    //         newChartData.push({
    //           'name': 'New Names',
    //           'value': this.totalNewNames.length
    //         });
    //         // this.pieChart = [...newChartData];
    //         const resArr = [];
    //         newChartData.forEach(function (item) {
    //           const i = resArr.findIndex(x => x.name === item.name);
    //           if (i <= -1) {
    //             resArr.push({ name: item.name, value: item.value });
    //           }
    //         }, this.pieChart = resArr);
    //       });
    //     });
    //   });
    // });

     // if (this.tickerElement) {
    //   if (this.tickerTime !== '') {
    //     if (JSON.parse(this.tickerTime).showingTicker === true) {
    //       this.tickerElement.nativeElement.style.opacity = 1;
    //     } else {
    //       this.tickerElement.nativeElement.style.opacity = .05;
    //     }
    //   }
    // }

    // if (this.displayBackground === false) {

    //   if (this.evaluationTimeElement) {
    //     // tslint:disable-next-line:max-line-length
    //     this.evaluationTimeElement.nativeElement.style.backgroundImage = this.BackgroundUrl + this.imgBackground[this.backgroundCounter] + '.jpg)';
    //     this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';
    //   }
    // } else {
    //   if (this.evaluationTimeElement) {
    //     this.evaluationTimeElement.nativeElement.style.backgroundImage = this.tempBackground;

    //   }
    // }


       // const comeFromData = JSON.stringify({ 'comeFrom': 'summary', pageNumber: selectedPage });
    // this.isImage = false;
    // this.isEvaluation = true;
    // this.numberChanged = comeFromData;
    // this.changingPage = JSON.stringify({ 'currentPage': this.pageNumber, 'moveTo': '' });

      // navigateToPage(indexPage) {
  //   this.navigatePageIndex = indexPage;
  // }
  // overviewToggle(state: any) {
  //   this.overviewDisplay = (state.split(',')[0] === 'false') ? false : true;
  //   if (!this.overviewDisplay) {
  //     setTimeout(() => {
  //       document.getElementById('thumbnail' + state.split(',')[1]).scrollIntoView();
  //     }, 1);
  //   }
  // }
 // pageChange(changePageTo: string) {
  //   this.timeToReset = false;
  //   const changePageToObj = JSON.parse(changePageTo);
  //   if (changePageToObj.moveTo === 'next') {
  //     this.cantMoveForward = '';
  //     this.pageNumber += 1;
  //     if (this.pageNumber >= this.passTotalPages) {
  //       this.pageNumber = this.passTotalPages;
  //     }
  //   }
  //   if (changePageToObj.moveTo === 'previous') {
  //     this.pageNumber -= 1;
  //     this.cantMoveForward = '';
  //     if (this.pageNumber <= 1) {
  //       this.pageNumber = 1;
  //     }
  //   }
  //   if (changePageToObj.moveTo === 'home') {
  //     this.cantMoveForward = '';
  //     this.pageNumber = 1;
  //   }
  //   if (changePageToObj.moveTo === 'summary') {
  //     this.cantMoveForward = '';
  //     this.pageNumber = this.passTotalPages;
  //   }
  //   if (changePageToObj.moveTo === '') {
  //     this.cantMoveForward = '';
  //     this.pageNumber = changePageToObj.currentPage;
  //   }
  //   this.currentProgress = (this.pageNumber / this.passTotalPages) * 100;
  //   this.changingPage = changePageTo;
  //   this.numberChanged = '';
  //   this.pageDirection = 0;
  // }
