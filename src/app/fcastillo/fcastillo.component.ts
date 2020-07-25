import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-fcastillo',
  templateUrl: './fcastillo.component.html',
  styleUrls: ['./fcastillo.component.scss']
})
export class FcastilloComponent implements OnInit {
  isSpanish = false
  isDarkMode = false
  isMute = false
  @ViewChild('videoPlayer') videoplayer: ElementRef
  constructor() { }

  ngOnInit(): void {

  }

  changeLanguage(){
    this.isSpanish = !this.isSpanish
 }

  darkMode(){
    this.isDarkMode = !this.isDarkMode
  }

  mute(){
    this.isMute = !this.isMute
  }


}
