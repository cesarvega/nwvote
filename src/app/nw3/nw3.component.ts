import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';

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
  toogleFont = true;
  elem: any;
  isFullscreen = false;
  mainMenu = true;
  fontIndexCounter = 0;
  isTableOfContent = false;
  isSettings = false;
  myspeech = new Speech();
  hasSpeechBrowserSupport: boolean;



  constructor(@Inject(DOCUMENT) private document: any, private _hotkeysService: HotkeysService) {
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

  }

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
