import { Component, Inject, OnInit } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-nw3',
  templateUrl: './nw3.component.html',
  styleUrls: ['./nw3.component.scss']
})
export class NW3Component implements OnInit {

  constructor(@Inject(DOCUMENT) private document: any) { }

  fonts = ['caviar','Camaro','Chelsea','Gacor','NyataFTR','Pinkerston','Quicksand_Book','Quicksand_Light'
  ,'Cruncho','LilacBlockDemo','Medhurst','NewYork' ];
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
  



  ngOnInit(): void {
  }

  fontTheme() {
    this.toogleFont = !this.toogleFont;
    this.font2 = this.fonts[this.fontIndexCounter];
    if (this.fontIndexCounter===7) { 
      this.fontIndexCounter = 0; 
    }else {

      this.fontIndexCounter++;
    }
  }


  toogleMenu(){
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
