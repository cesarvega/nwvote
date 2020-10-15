import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  imageIndex = 'ezgif.com-gif-maker.gif';
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

    
    let counter = 1;
    setTimeout(() => {
      this.imageIndex = ((counter < 10 )?'mars_0000':'mars_000') + counter.toString() + '.png' 
      counter++;
    }, 1000);
  }



 step(startTime) {
  if (!this.timeWhenLastUpdate) this.timeWhenLastUpdate = startTime;

  this.timeFromLastUpdate = startTime - this.timeWhenLastUpdate;

  if (this.timeFromLastUpdate > this.timePerFrame) {
    // $element.attr('src', this.imagePath + `/Eye-${this.frameNumber}.svg`);

    this.imageIndex = (this.frameNumber < 10 )?'mars_0000':'mars_000' + this.frameNumber + '.png'  

    this.timeWhenLastUpdate = startTime;

    if (this.frameNumber >= this.totalFrames) {
      this.frameNumber = 1;
    } else {
       this.frameNumber = this.frameNumber + 1;
    }        
  }
}

}
