import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];

  createPostIt = true;
  slideBackground = 'background-image: url(http://www.bipresents.com/bsr_slides/TEST_BI_ALEXA/thumbnails/001.jpg);';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  pageCounter = ' 10/40';
  constructor() { }

  ngOnInit(): void {
  }

  
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    console.log( event.previousIndex, event.currentIndex);
    
 
  }
  entered(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    console.log( event.previousIndex, event.currentIndex);
    
  }

  openDialog(name){}
}
