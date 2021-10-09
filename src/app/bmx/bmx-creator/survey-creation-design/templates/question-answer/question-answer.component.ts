import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent extends RatingScaleComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar) {
    super(dragulaService,_snackBar)
  }

  ngOnInit(): void {
    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });
  }

  insertAnswerColumn() {
    this.columnsNames.push('Answers' + (this.commentColumnCounter));
    this.bmxItem.componentText.forEach((object, index) => {
      let coulmnName = 'Answers' + this.commentColumnCounter
      if (index > 0) {
        object[coulmnName] = ''
      } else {
        object[coulmnName] = 'Answers'
      }
    });
    this.commentColumnCounter++
  }
}
