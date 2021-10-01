import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';

@Component({
  selector: 'app-narrow-down',
  templateUrl: './narrow-down.component.html',
  styleUrls: ['./narrow-down.component.scss']
})
export class NarrowDownComponent extends RatingScaleComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  SLECTED_ROWS = []
  constructor() {
    super()
  }

  ngOnInit(): void {

    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" ) {
        this.columnsNames.push(value)
      }
    });


    

    
  }

  setRating(s , d){
console.log('');

  }
}
