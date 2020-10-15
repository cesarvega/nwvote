import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  imageIndex = 'mars_00001.png';
  // imageIndex = 'mars_00001.png';
  filmLenght = 20;
  imagePath = '/images';
  totalFrames = 18;
  animationDuration = 1300;
  timePerFrame = this.animationDuration / this.totalFrames;
  timeWhenLastUpdate;
  timeFromLastUpdate;
  frameNumber = 1;
  
  constructor() { }

  ngOnInit(): void {
  }

  animate(){
    this.imageIndex = 'ezgif.com-gif-maker.gif';
    setInterval(() => {
      this.imageIndex = 'mars_00001.png';
    }, 3000);
  }
}
