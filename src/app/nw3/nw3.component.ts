import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
import { Nw3Service } from './nw3.service';
import { ActivatedRoute } from '@angular/router';


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
  hasSpeechBrowserSupport: boolean;
  myspeech = new Speech();


  slideNextPart = 'nw_slides/Test_WELL_PLATFORM/thumbnails/014.jpg)';
  slideBackground = 'url(http://bipresents.com/nw2/' + this.slideNextPart;



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
  projectId: any;
  projectName: any;
  bsrProjectId: any;
  negativePronunciation: any;
  recraftChecked: any;
  slideModel: any = {
    'presentationid': '3157',
    'slideNumber': '18',
    'NameRanking': '',
    'NewNames': '',
    'NamesToExplore': '',
    'NamesToAvoid': '',
    'Direction': 'Next',
    'KanaNamesNegative': '',
    'recraft': '0',
  };
  go: boolean;
  // 3375,23,'Positive','','','','Next','',0

  constructor(@Inject(DOCUMENT) private document: any, private _NW3Service: Nw3Service,private activatedRoute: ActivatedRoute,
   private _hotkeysService: HotkeysService) {



    this.activatedRoute.params.subscribe(params => {
      this.projectName = params['id'];
      localStorage.setItem('projectName',   this.projectName); 
      this._NW3Service.getProjectId(this.projectName).subscribe((data:any) =>{
        this.projectId = data[0].PresentationId;
        localStorage.setItem('data',  data[0].PresentationId); 
      })  
    });


    this._hotkeysService.add(new Hotkey('1', (event: KeyboardEvent): boolean => {
      // this.selectedOpt('positive');
      // console.log('1 number key');
      return false;
    }, undefined, 'Set slide to positive'));
    this._hotkeysService.add(new Hotkey('2', (event: KeyboardEvent): boolean => {
      // this.selectedOpt('neutral');
      // console.log('2 number key');
      return false;
    }, undefined, 'Set slide to neutral'));
    this._hotkeysService.add(new Hotkey('3', (event: KeyboardEvent): boolean => {
      // this.selectedOpt('negative');
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

  }


  ngOnInit(): void {
    this.getNwVoteData( this.projectId);
    this.saveData(this.slideModel);
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


  saveData(savingObj) {
    // const temp = JSON.parse(savingObj);
    // temp.KanaNamesNegative = this.negativePronunciation.join(',');
    // temp.recraft = (this.recraftChecked) ? 1 : 0;
    savingObj = JSON.stringify(savingObj);
    this._NW3Service.getSaveNSlideInfo(savingObj).subscribe(
      data => {
        this.go = (data[0].presentationStatus === '0') ? true : false;
        // slideBackground = 'url(http://bipresents.com/nw2/' + this.slideNextPart;  slideNextPart = 'Test_WELL_PLATFORM/thumbnails/014.jpg)';
        this.slideBackground =  this.slideBackground + data[0].SlideBGFileName +')';
        // this.setDataToDisplay(data, 'save');
      }
    );
    // this._BipresentGlobalService.saveSlideInformation(savingObj).subscribe(
    //   data => {
    //     this.setDataToDisplay(data, 'save');
    //   }
    // );
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




}
