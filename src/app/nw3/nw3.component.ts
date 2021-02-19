import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
import { Nw3Service } from './nw3.service';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
// import { MatSlideToggle, MatCheckbox } from '@angular/material';

@Component({
  selector: 'app-nw3',
  templateUrl: './nw3.component.html',
  styleUrls: ['./nw3.component.scss']
})
export class NW3Component implements OnInit {


  fonts = ['caviar', 'Camaro', 'Chelsea', 'Gacor', 'NyataFTR', 'Pinkerston', 'Quicksand_Book', 'Quicksand_Light'
    , 'Cruncho', 'LilacBlockDemo', 'Medhurst', 'NewYork'];
  secodaryFontIndex = 0;
  font1 = this.fonts[this.secodaryFontIndex];
  font2 = this.fonts[0];
  font3 = this.fonts[this.secodaryFontIndex];
  font4 = this.fonts[this.secodaryFontIndex];
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
  slideBackground = 'url(http://bipresents.com/nw2/' ;

  VotersList: any;
  votersBadge: any;
  nwPositiveVote: any;
  nwNegativeVote: any;
  nwNeutralVote: any;
  nwPositiveVoteUsers: any;
  nwNegativeVoteUsers: any;
  nwNeutralVoteUsers: any;
  projectData: any;
  name: any ;
  projectName: any;
  bsrProjectId: any;
  negativePronunciation: any;
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
   switchButton: string;
   cantMoveForward: string;
   numberChanged: string;
   navigatePageInput: string;
   showTicker = new EventEmitter<string>();
   changePage = new EventEmitter<string>();
   currentSlideType = new EventEmitter<string>();
   reset = new EventEmitter<boolean>();
   showBackground = new EventEmitter<boolean>();
   hideBackgroundEmitter = new EventEmitter<boolean>();
   hideShowOverview = new EventEmitter<string>();
  tickeObj = {
    showingTicker: false,
    active: true
  };
  // faHome = faHome;
  // faAngleLeft = faAngleLeft;
  // faPhone = faMobileAlt;
  // faTrash = faTrashAlt;
  // faAngleRight = faAngleRight;
  // faEraser = faEraser;
  // faImage = faImage;
  // faQuestion = faQuestionCircle;
  // faVoteYea = faVoteYea;
  // tickerIcon = faEye;
  // microphoneIcon = faMicrophone;
  initialPage = 1;
  currentPage = this.initialPage;
  hideMenu = true;
  hideBackground = false;
  mute: boolean;
  nwVote=false;
  buttonOptionsObj;
  hideButton = true;
  isNonProp = true;
  showHelp = false;
  vote = true;

  stopMovingForward = false;
  overViewState = true;

  // slideCtrl = new FormControl();
  // filteredSlides: Observable<Slide[]>;

  // slides: Slide[];
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
  displayBackground: boolean;
  tempBackground: string;
  // evaluationTimeElement: any;
  slideType: any;
  totalPositive: number;
  totalNeutral: number;
  katakanaNames: any;
  BackgroundUrl: any;
  backgroundCounter: any;
  summarySlideMinWidth: number;
  rationaleMinWidth: number;
  // separateCandidateElement: any;
  // switchPosNegElement: any;
  groupRationale: any;
  rationale: any;
  category: any;
  positiveChecked: boolean;
  neutralChecked: boolean;
  negativeChecked: boolean;
  isPipeSplit: boolean;
  isGroupNameTooltip: boolean;
  summaryViewFlexLayout: string;
  cantMove: any;
  // pronunciationElement: any;
  newNameFormField;
  commentsFormField;
  // nameCandidateElement: any;
  // pronunciationParentElement: any;
  hoverPositive: boolean;
  hoverNeutral: boolean;
  hoverNegative: boolean;
  VotersListOn: boolean;
  postRadio: boolean;
  isNewName: boolean;
  NeuRadio: boolean;
  NegRadio: boolean;
  pageNumber: any;
  faVolumeUp: any;
  boxes: any;
  moving: boolean;
  wasClicked: any;
  listened: any;
  selectBackground: any;
  tempObj: any;
  tickerInterval: number;
  slideChange: any;
  resetTime: boolean;
  auto: any;
  timer: any;
  interval;
  pieChart: any[];
  posCount: number;
  neuCount: number;
  negCount: number;
  hasBackground: boolean;
  totalNewNames: any[];
  // tickerElement: any;
  tickerTime: string;
  @Input() currentSlidePageInfo = '';
  @Input() projectId: string;
  imgBackground: any;
  // slideImageElement: any;
  savePage: any;
  results: any;
  thumbNails: string;
  passTotalPages: number;

  @ViewChild('positiveButton') positiveButtonToggle: MatSlideToggle;
  @ViewChild('neutralButton') neutralButtonToggle: MatSlideToggle;
  @ViewChild('negativeButton') negativeButtonToggle: MatSlideToggle;
  @ViewChild('recraftButton') recraftButtonToggle: MatSlideToggle;
  @ViewChild('switchPosNeg') switchPosNegElement: ElementRef;
  @ViewChild('txtComments') txtCommentsElement: ElementRef;
  @ViewChild('extraComments') extraCommentsElement: ElementRef;
  @ViewChild('txtNewName') txtNewNameElement: ElementRef;
  @ViewChild('ticker') tickerElement: ElementRef;
  @ViewChild('nameCandidate') nameCandidateElement: ElementRef;
  @ViewChild('slideImage') slideImageElement: ElementRef;
  @ViewChild('evaluationTime') evaluationTimeElement: ElementRef;
  @ViewChild('pronunciationParent') pronunciationParentElement: ElementRef;
  @ViewChildren('pronunciation') pronunciationElement;
  @ViewChildren('separateCandidate') separateCandidateElement: QueryList<MatCheckbox>;

  constructor(@Inject(DOCUMENT) private document: any, private _NW3Service: Nw3Service,private activatedRoute: ActivatedRoute,
   private _hotkeysService: HotkeysService) {

    this._hotkeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {

      // but true to go through positive check
      if (!this.stopMovingForward || !this.vote) {
        this.selectPage('next');
      } else {
        
      }
      return false;
    }, undefined, 'Move to next slide'));
    this._hotkeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
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
      if (this.vote === true) {
        this.vote = false;
      } else {
        this.vote = true;
      }
      return false;
    }, undefined, ''));
    this._hotkeysService.add(new Hotkey('1', (event: KeyboardEvent): boolean => {
      this.selectedOpt('positive');
      // console.log('1 number key');
      return false;
    }, undefined, 'Set slide to positive'));
    this._hotkeysService.add(new Hotkey('2', (event: KeyboardEvent): boolean => {
      this.selectedOpt('neutral');
      // console.log('2 number key');
      return false;
    }, undefined, 'Set slide to neutral'));
    this._hotkeysService.add(new Hotkey('3', (event: KeyboardEvent): boolean => {
      this.selectedOpt('negative');
      // console.log('3 number key');
      return false;
    }, undefined, 'Set slide to negative'));
    this._hotkeysService.add(new Hotkey('4', (event: KeyboardEvent): boolean => {
      // this.recraft();
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
        console.error('An error occured while initializing : ', e);
      });
    this.hasSpeechBrowserSupport = this.myspeech.hasBrowserSupport();

    // var scale = 'scale(1)';
    // document.body.style.webkitTransform = scale;    // Chrome, Opera, Safari
    // document.body.style.msTransform = scale;       // IE 9
    // document.body.style.transform = scale;
    document.body.style.zoom = 1.10;
    setTimeout(() => {
      this.movingSlide = true;
    }, 300);

  }

  getProjectData(projectId) {
    this._NW3Service.getProjectData(projectId).subscribe(
      (data: string) => {
        // console.log(data);
        this.results = JSON.stringify(data);
        this.thumbNails = data;
        this.passTotalPages = data.length;
        this.projectData = this.results;
      },
      err => console.log(err)
    );
  }

  
  ngOnInit(): void {


    this.activatedRoute.params.subscribe(params => {
      this.projectName = params['id'];
      localStorage.setItem('projectName',   this.projectName); 
      this._NW3Service.getProjectId(this.projectName).subscribe((data:any) =>{
        this.projectId = data[0].PresentationId;
        localStorage.setItem('data',  data[0].PresentationId); 
        this.getProjectData(this.projectId);


        this.getNwVoteData( this.projectId);
        this.saveData(this.slideModel);
        this.changes();

      })  
    });

  
  }

    // tslint:disable-next-line:use-life-cycle-interface
    // ngOnChanges() {
    changes() {
      // if (this.auto) {
      if (this.auto) {
        let time = this.timer;
        this.interval = setInterval(() => {
          console.log(time);
          time--;
          if (time < 0) {
            this.slideChange.emit(39);
            clearInterval(this.interval);
            console.log('Ding!');
          };
        }, 1000);
      }
      this.slideModel.NamesToExplore = (this.txtCommentsElement) ? this.txtCommentsElement.nativeElement.value : '';
      this.slideModel.NewNames = (this.txtNewNameElement) ? this.txtNewNameElement.nativeElement.value : '';
  
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
  
          this._NW3Service.getRetainTypeName(this.projectId, "New").subscribe((data: Array<object>) => {
            data.forEach(ele => {
              this.totalNewNames.push(ele);
            });;
            ;
          });
  
  
          this._NW3Service.getRetainTypeName(this.projectId, 'Neutral').subscribe((resultNeu: Array<object>) => {
            this.totalNeutral = resultNeu.length + this.neuCount;
            newChartData.push({
              'name': 'Neutral',
              'value': resultNeu.length + this.neuCount
            });
            this._NW3Service.getRetainTypeName(this.projectId, 'Negative').subscribe((resultNeg: Array<object>) => {
              newChartData.push({
                'name': 'Negative',
                'value': resultNeg.length + this.negCount
              });
  
              newChartData.push({
                'name': 'New Names',
                'value': this.totalNewNames.length
              });
              // this.pieChart = [...newChartData];
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
  
      const projectData = JSON.parse(this.projectData);
      this.projectName = JSON.parse(this.projectData)[0].DisplayName;
      if (this.tickerElement) {
        if (this.tickerTime !== '') {
          if (JSON.parse(this.tickerTime).showingTicker === true) {
            this.tickerElement.nativeElement.style.opacity = 1;
          } else {
            this.tickerElement.nativeElement.style.opacity = .05;
          }
        }
      }
  
      if (this.displayBackground === false) {
  
        if (this.evaluationTimeElement) {
          // tslint:disable-next-line:max-line-length
          this.evaluationTimeElement.nativeElement.style.backgroundImage = this.BackgroundUrl + this.imgBackground[this.backgroundCounter] + '.jpg)';
          this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';
        }
      } else {
        if (this.evaluationTimeElement) {
          this.evaluationTimeElement.nativeElement.style.backgroundImage = this.tempBackground;
  
        }
      }
  
      if (this.resetTime !== false) {
        this.positiveChecked = false;
        this.neutralChecked = false;
        this.negativeChecked = false;
        this.recraftChecked = false;
        this.txtNewNameElement.nativeElement.value = '';
        this.txtNewNameElement.nativeElement.style = '';
        this.txtCommentsElement.nativeElement.style = '';
        this.txtCommentsElement.nativeElement.value = '';
        this.setNewNameElement('');
        this.setCommentsElement('');
      } else {
        this.slideModel.NewNames = (this.txtNewNameElement) ? this.txtNewNameElement.nativeElement.value : '';
        if (this.tickerTime !== '') {
          let lastVisitedPageNumber;
          this.collectGroupRanks();
          if (JSON.parse(this.tickerTime).active !== true) {
            const pageObj = JSON.parse(this.currentSlidePageInfo);
            if (pageObj.moveTo === 'summary') {
              this.savePage = this.pageNumber;
            }
            this.pageNumber = (this.currentSlidePageInfo !== '{}') ? pageObj.currentPage : this.pageNumber;
            this.slideType = projectData[this.pageNumber - 1].SlideType.trim();
            if (this.slideType !== 'Image') {
              if (pageObj.moveTo === 'previous') {
                lastVisitedPageNumber = this.pageNumber + 1;
              }
              if (pageObj.moveTo === 'next') {
                lastVisitedPageNumber = this.pageNumber - 1;
              }
              if (pageObj.moveTo === 'summary') {
                lastVisitedPageNumber = this.savePage;
              }
              this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
            } else {
              setTimeout(() => {
                const bgImage = 'url(http://bipresents.com/nw2/' + projectData[this.pageNumber - 1].SlideBGFileName + ')';
                this.slideBackground = bgImage;
                this.slideImageElement.nativeElement.style.backgroundSize = '100% 100%';
                lastVisitedPageNumber = (pageObj.moveTo === 'previous') ? this.pageNumber + 1 : this.pageNumber - 1;
                this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
              }, 100);
            }
          }
        } else {
          const pageObj = JSON.parse(this.currentSlidePageInfo);
          this.pageNumber = (this.currentSlidePageInfo !== '{}') ? pageObj.currentPage : this.pageNumber;
          this.slideType = projectData[this.pageNumber - 1].SlideType.trim();
          this.collectGroupRanks();
          if (this.slideType !== 'Image') {
            const lastVisitedPageNumber = (pageObj.moveTo === 'previous') ? this.pageNumber + 1 : this.pageNumber - 1;
            this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
          } else {
            setTimeout(() => {
              const bgImage = 'url(http://bipresents.com/nw2/' + projectData[this.pageNumber - 1].SlideBGFileName + ')';
              this.slideBackground = bgImage;
              this.slideImageElement.nativeElement.style.backgroundSize = '100% 100%';
              const lastVisitedPageNumber = (pageObj.moveTo === 'previous') ? this.pageNumber + 1 : this.pageNumber - 1;
              this.setEvaluationData(lastVisitedPageNumber, pageObj.moveTo);
            }, 100);
          }
        }
      }
  
  
    }
  
    collectGroupRanks() {
      this.slideModel.NameRanking = '';
      if (this.separateCandidateElement) {
        this.separateCandidateElement.toArray().forEach((element, index) => {
          if (element.checked) {
            if (index === (this.separateCandidateElement.toArray().length - 1)) {
              this.slideModel.NameRanking = this.slideModel.NameRanking + 'Positive';
            } else {
              this.slideModel.NameRanking = this.slideModel.NameRanking + 'Positive##';
            }
          } else {
            if (index === (this.separateCandidateElement.toArray().length - 1)) {
              this.slideModel.NameRanking = this.slideModel.NameRanking + 'Negative';
            } else {
              this.slideModel.NameRanking = this.slideModel.NameRanking + 'Negative##';
            }
          }
        });
      }
    }
  
  
  startTicerInterval() {
    this.tickerInterval = setInterval(() => {
      this.moveLeft();
    }, 2000);
  }

  moveSlide(e) {
    if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 40 || e.keyCode === 38) {
      this.slideChange.emit(e.keyCode);
    }
  }

  mouseEnter() {
    clearInterval(this.tickerInterval);
  }

  mouseLevae() {
    this.startTicerInterval();
  }

  additionalComments(comments: string) {
    const note = comments.replace(/'/g, '`');
    this._NW3Service.saveNotes(this.projectId, note).subscribe(data => {
      console.log(data);
    });
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

  showPieChart() {
    this.showRankedNames = false;
    this.isNewName = false;
    this.postRadio = false;
    this.NeuRadio = false;
    this.NegRadio = false;
  }

  onSelect(clickEvent) {
    this.getSelectedRank(clickEvent.name);
  }

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
    if (this.movingSlide) {
      this.movingSlide = false;
      let movePage = '';
      this.tickeObj.active = false;
      this.showTicker.emit(JSON.stringify(this.tickeObj));
      if (this.hideBackground) {
        this.hideBackground = !this.hideBackground;
        this.showBackground.emit(this.hideBackground);
      }
      if (movingTo === 'next') {
        if (this.currentPage >= this.totalPages) {
          this.currentPage = this.totalPages;
          this.switchHideButton(this.currentPage - 1);
          movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
          this.changePage.emit(movePage);
        } else {
          this.currentPage += 1;
          this.switchHideButton(this.currentPage - 1);
          movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
          this.changePage.emit(movePage);
        }
      } else if (movingTo === 'home') {
        this.currentPage = 1;
        this.switchHideButton(this.currentPage - 1);
        movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
        this.changePage.emit(movePage);
      } else if (movingTo === 'summary') {
        this.currentPage = this.totalPages;
        this.switchHideButton(this.currentPage - 1);
        movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
        this.changePage.emit(movePage);
      } else if (movingTo === 'previous') {
        if (this.currentPage <= this.initialPage) {
          this.currentPage = this.initialPage;
          this.switchHideButton(this.currentPage - 1);
          movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
          this.changePage.emit(movePage);
        } else {
          this.currentPage -= 1;
          this.switchHideButton(this.currentPage - 1);
          movePage = '{"currentPage":' + this.currentPage + ', "moveTo":"' + movingTo + '"}';
          this.changePage.emit(movePage);
        }
      } else {
        this.switchHideButton(this.currentPage);
        movePage = '{"currentPage":' + this.currentPage + ', "moveTo":""}';
        this.changePage.emit(movePage);
      }
      setTimeout(() => {
        this.movingSlide = true;
      }, 300);
    }
  }


  switchHideButton(number) {
    this.currentSlideType.emit(this.results[number].SlideType);
    if (this.buttonOptionsObj[number].SlideType === 'Image' || this.buttonOptionsObj[number].SlideType === 'NameSummary') {
      this.hideButton = true;
      this.stopMovingForward = false;
    } else {
      this.hideButton = false;
      if (this.buttonOptionsObj[number].SlideDescription.search('##') >= 0) {
        this.stopMovingForward = false;
      } else {
        this.stopMovingForward = true;
      }
    }
  }



  //  Businness logic 

  getProjectId(name) {
    this._NW3Service.getProjectId(name).subscribe(
      (data: object) => {
        this.projectId = data[0].PresentationId;
        this.bsrProjectId = data[0].BSRPresentationid;
        this.getNwVoteData(this.projectId);
      },
      err => console.log(err)
    );
  }

  getNwVoteData(projectId) {
    // this.go = !this.go;
    this._NW3Service.getNwVoteData(this.projectName, this.projectName).subscribe(res => {
        const data = JSON.parse(res.d);
        this.VotersList = data.VotersList;
        this.votersBadge = data.VotersList.length;
        this.nwPositiveVote = data.Positive;
        this.nwNegativeVote = data.Negative;
        this.nwNeutralVote = data.Neutral;

        this.nwPositiveVoteUsers = data.PositiveVoters
        this.nwNegativeVoteUsers = data.NegativeVoters;
        this.nwNeutralVoteUsers = data.NeutralVoters;

      })
  }




  recraft() {
    // alert("Hello! I am an alert box!!");
    this.recraftChecked = !this.recraftChecked;
  }

  setNewNameElement(setColor) {
    this.newNameFormField.getElementsByClassName('mat-form-field-outline')[0].style.color = setColor;
    this.newNameFormField.getElementsByClassName('mat-form-field-outline')[1].style.color = setColor;
    this.newNameFormField.getElementsByClassName('mat-form-field-label')[0].style.color = setColor;
  }

  setCommentsElement(setColor) {
    this.commentsFormField.getElementsByClassName('mat-form-field-outline')[0].style.color = setColor;
    this.commentsFormField.getElementsByClassName('mat-form-field-outline')[1].style.color = setColor;
    this.commentsFormField.getElementsByClassName('mat-form-field-label')[0].style.color = setColor;
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
    // DB has Names to Explore but is saving Comment Box
    // this.slideModel.NamesToExplore = (this.txtCommentsElement) ? this.txtCommentsElement.nativeElement.value : '';
    // this.slideModel.NewNames = (this.txtNewNameElement) ? this.txtNewNameElement.nativeElement.value : '';

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

  saveData(savingObj) {
    // const temp = JSON.parse(savingObj);
    // temp.KanaNamesNegative = this.negativePronunciation.join(',');
    // temp.recraft = (this.recraftChecked) ? 1 : 0;
    savingObj = JSON.stringify(savingObj);
    this._NW3Service.getSaveNSlideInfo(savingObj).subscribe(
      data => {
        this.go = (data[0].presentationStatus === '0') ? true : false;
        // slideBackground = 'url(http://bipresents.com/nw2/' + this.slideNextPart;  slideNextPart = 'Test_WELL_PLATFORM/thumbnails/014.jpg)';
        this.slideNextPart  =  data[0].SlideBGFileName;
        this.slideBackground = 'url(http://bipresents.com/nw2/' ;
        this.slideBackground =  this.slideBackground + this.slideNextPart  +')';
        this.setDataToDisplay(data, 'save');
      }
    );
    // this._BipresentGlobalService.saveSlideInformation(savingObj).subscribe(
    //   data => {
    //     this.setDataToDisplay(data, 'save');
    //   }
    // );
  }



  goVote(){
    this.isGoVoteOn = ! this.isGoVoteOn;
  }

  noClickanyWhere() {
    this.hoverPositive = false;
    this.hoverNeutral = false;
    this.hoverNegative = false;
    this.VotersListOn = false;
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


  moveLeft1(){
    this.saveData(this.slideModel);
  }

  moveRight(){
    this.saveData(this.slideModel);
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
    this.groupName = '';
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
                // tslint:disable-next-line:max-line-length
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

    this.slideType = data[0].SlideType;
    console.log('refactroing data', data[0]);
    if (this.slideType === 'NameSummary') { 
      this._NW3Service.getNotes(this.projectId).subscribe(note => {
        this.extraCommentsElement.nativeElement.value = note[0].NotesExplore.replace(/`/g, '\'');
      });
    }

    this.totalPositive = data[0].TotPositive - 1;
    this.totalNeutral = data[0].TotNeutral - 1;
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

    if (data[0].GroupedNames !== '') {
      if (data[0].GroupedNames.includes('##')) {
        this.groupName = data[0].GroupedNames.split('##');
        this.groupName.forEach(element => {
          if (element.split('|').length > 1) {
            this.isPipeSplit = true;
          }

        });
        this.isGroupNameTooltip = true;
        this.summaryViewFlexLayout = 'column wrap';
      } else {
        this.groupName = data[0].GroupedNames.split('$$');
        this.isGroupNameTooltip = false;
        this.summaryViewFlexLayout = 'column';
      }

      let counter = 0;
      let index = 0;
      this.groupName.forEach(element => {
        // this.groupName[index] = element.replace('(', '|(');
        if (counter < element.length) {
          counter = element.length;
          this.summarySlideMinWidth = (counter * 20) + 20;
          this.rationaleMinWidth = 1000 - this.summarySlideMinWidth;
          if (this.summarySlideMinWidth > 900) {
            this.summarySlideMinWidth = 800;
            this.rationaleMinWidth = 200;
          }
        }
        index = index + 1;
      });

      setTimeout(() => {
        this.separateCandidateElement.toArray().forEach((element, index) => {
          const arrRank = data[0].NameRanking.split('##');
          const areLike = this.areAllLike(arrRank);
          if (data[0].NameRanking.split('##')[0] !== '') {
            this.switchPosNegElement.nativeElement.checked = (areLike) ? true : false;

            if (arrRank[index] === 'Negative' || arrRank[index] === 'novalue') {
              element.checked = false;
            } else {
              element.checked = true;
            }
          } else {
            this.switchPosNegElement.nativeElement.checked = false;
          }

        });
      }, 50);
    } else {
      this.name = data[0].Name;
      this.name = this.name.replace('(', '|(');
      if (this.evaluationTimeElement && data[0].TemplateFileName !== 'images/BackGrounds/Default.jpg') {
        // tslint:disable-next-line:max-line-length
        this.evaluationTimeElement.nativeElement.style.backgroundImage = this.BackgroundUrl + this.hideBackground[this.backgroundCounter] + '.jpg)';
        this.evaluationTimeElement.nativeElement.style.backgroundSize = 'cover';
      }
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
    if (data[0].GroupedNames === '') {
      if (data[0].NameRanking === 'Positive') {
        setTimeout(() => {
          this.positiveChecked = false;
          this.neutralChecked = false;
          this.negativeChecked = false;
          this.selectedOpt(data[0].NameRanking.toLowerCase());
        }, 10);
      } else if (data[0].NameRanking === 'Neutral') {
        setTimeout(() => {
          this.positiveChecked = false;
          this.neutralChecked = false;
          this.negativeChecked = false;
          this.selectedOpt(data[0].NameRanking.toLowerCase());
        }, 10);
      } else if (data[0].NameRanking === 'Negative') {
        setTimeout(() => {
          this.positiveChecked = false;
          this.neutralChecked = false;
          this.negativeChecked = false;
          this.selectedOpt(data[0].NameRanking.toLowerCase());
        }, 10);
      } else {
        if (data[0].SlideType === 'NameEvaluation') {
          this.cantMove.emit(true);
        }
        this.selectedOpt(data[0].NameRanking.toLowerCase());
      }
    } else {
      this.cantMove.emit(false);
    }

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

  selectedOpt(option) {
    this.newNameFormField = <HTMLInputElement>document.getElementById('newNameFormField');
    this.commentsFormField = <HTMLInputElement>document.getElementById('commentsFormField');
    if (this.newNameFormField) {
      this.newNameFormField.style.marginTop = '-30px';
    }
    if (this.commentsFormField) {
      this.commentsFormField.style.marginTop = '-30px';
    }
    if (option === 'positive' && this.positiveChecked === false) {
      this.positiveChecked = true;
      this.cantMove.emit(false);
      this.neutralChecked = false;
      this.negativeChecked = false;
      this.newNameColor = 'accent';
      this.commentsColor = 'accent';
      if (this.nameCandidateElement) {
        this.nameCandidateElement.nativeElement.style.opacity = 1;
        this.pronunciationParentElement.nativeElement.style.opacity = 1;
        this.setNewNameElement('');
        this.setCommentsElement('');
      }
    } else if (option === 'positive' && this.positiveChecked === true) {
      this.cantMove.emit(true);
      this.neutralChecked = false;
      this.positiveChecked = false;
      this.negativeChecked = false;
      this.newNameColor = '';
      this.commentsColor = '';
    } else if (option === 'neutral' && this.neutralChecked === false) {
      this.neutralChecked = true;
      this.cantMove.emit(false);
      this.positiveChecked = false;
      this.negativeChecked = false;
      this.newNameColor = 'primary';
      this.commentsColor = 'primary';
      if (this.nameCandidateElement) {
        this.nameCandidateElement.nativeElement.style.opacity = 1;
        this.pronunciationParentElement.nativeElement.style.opacity = 1;
        this.setNewNameElement('');
        this.setCommentsElement('#0d47a1');
      }
    } else if (option === 'neutral' && this.neutralChecked === true) {
      this.cantMove.emit(true);
      this.neutralChecked = false;
      this.positiveChecked = false;
      this.negativeChecked = false;
      this.commentsColor = '';
      this.newNameColor = '';
      if (this.nameCandidateElement) {
        this.setCommentsElement('');
      }
    } else if (option === 'negative' && this.negativeChecked === false) {
      this.neutralChecked = false;
      this.positiveChecked = false;
      this.negativeChecked = true;
      this.cantMove.emit(false);
      this.newNameColor = 'warn';
      this.commentsColor = 'warn';
      if (this.nameCandidateElement) {
        this.nameCandidateElement.nativeElement.style.opacity = 0.3;
        this.pronunciationParentElement.nativeElement.style.opacity = 0.3;
        this.setNewNameElement('#b71c1c');
        this.setCommentsElement('#b71c1c');
      }
    } else {
      this.negativeChecked = false;
      this.neutralChecked = false;
      this.positiveChecked = false;
      this.newNameColor = '';
      this.commentsColor = '';
      if (this.nameCandidateElement) {
        this.nameCandidateElement.nativeElement.style.opacity = 1;
        this.pronunciationParentElement.nativeElement.style.opacity = 1;
        this.setNewNameElement('');
        this.setCommentsElement('');
      }
    }
    if (this.japanese) {
      // this.faVolumeUp = null;
    }
  }
  areAllLike(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== 'Positive') {
        return false;
      }
    }
    return true;
  }



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

  // new mobile NW 
  sendNameToMobileNW() {
    // this.go = !this.go;
    this._NW3Service.sendGoSignalVoting(
      JSON.parse(this.projectData)[0].DisplayName, this.go).subscribe(res => {
        console.log(res);

      })
  }

  deleteParticipant(participant: string) {
    if(confirm("Are sure you would like to delete " + participant + '?')) {
      this._NW3Service.DeleteUserFromProject(this.projectName, participant).subscribe(res => {

      }); 
      console.log("Implemented delete functionality here ");
    }
      
  }

}

