import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  allComplete: boolean = false;
  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar, _bmxService: BmxService,public deviceService: DeviceDetectorService) {
    super(dragulaService, _snackBar, _bmxService,deviceService);
  }

  ngOnInit(): void {
    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames
  }

  upLoadNamesAndRationales(list: string) {
    this.bmxItem.componentSettings[0].randomizeTestNames = (this.randomizeTestNames) ? true : false
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const rows = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split("\t");
      this.extraColumnCounter = 1
      this.columnsNames.forEach((column, index) => {
        if (column == 'name candidates' || column == 'test names' || column == 'names' || column == 'questions') {
          this.columnsNames[index] = 'nameCandidates'
        } else if (column == 'name rationale' || column == 'rationale' || column == 'rationales') {
          this.columnsNames[index] = 'rationale'
        } else if (column == 'katakana') {
          this.columnsNames[index] = 'katakana'
        } else if (column == 'options') {
          this.columnsNames[index] = 'options'
        }
      });
      this.TESTNAMES_LIST = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != "" && rows[i].length > 6) {
          let objectColumnDesign = {};
          if (this.ASSIGNED_CRITERIA.length > 0) {//NO APLICA
            this.bmxItem.componentSettings[0].CRITERIA = true
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e]
              }
            }
            objectColumnDesign['CRITERIA'] = []
            this.ASSIGNED_CRITERIA.forEach(criteria => {
              objectColumnDesign['CRITERIA'].push({
                name: criteria.name,
                STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                RATE: -1,
              })
            });
          }//NOT CRITERIA
          else {
            this.bmxItem.componentSettings[0].CRITERIA = false
            // objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e]
                // objectColumnDesign[this.columnsNames[e]] = 'multipleChoice'
              }
            }
          }

          this.TESTNAMES_LIST.push(objectColumnDesign);
        }
      }
      this.bmxItem.componentText = this.TESTNAMES_LIST;
    } else {
      // this.bmxItem.componentText.forEach((row, index) => {
      //   row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
      //   row.RATE = -1
      //   // this.leaveStar(index);
      // });
    }
  }

  saveMultipleChoice(checkBoxName, indexRow, value) {
    if (value.target.checked) {
      this.bmxItem.componentText[indexRow]['multipleChoice'] = (!this.bmxItem.componentText[indexRow]['multipleChoice']) ? checkBoxName + ',' : this.bmxItem.componentText[indexRow]['multipleChoice'] += checkBoxName + ','
    } else {
      this.bmxItem.componentText[indexRow]['multipleChoice'] = this.bmxItem.componentText[indexRow]['multipleChoice'].replace(checkBoxName + ',', '')
    }
  }

  insertAnswerColumn() {
    this.commentColumnCounter = 0
    this.columnsNames.forEach(columnName => {
      if (columnName.includes('Answers')) {
        this.commentColumnCounter++
        // this.RadioColumnList.push('RadioColumn' + this.commentColumnCounter)
      }
    });
    this.columnsNames.push('Answers' + (this.commentColumnCounter));
    this.bmxItem.componentText.forEach((object, index) => {
      let coulmnName = 'Answers' + this.commentColumnCounter
      if (index > 0) {
        object[coulmnName] = ''
      } else {
        object[coulmnName] = 'Answers'
      }
    });
    // this.commentColumnCounter++
  }
}
