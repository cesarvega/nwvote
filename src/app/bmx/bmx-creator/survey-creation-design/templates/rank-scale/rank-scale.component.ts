import { DragulaService } from 'ng2-dragula';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rank-scale',
  templateUrl: './rank-scale.component.html',
  styleUrls: ['./rank-scale.component.scss']
})
export class RankScaleComponent extends RatingScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;

  rankingType = 'dropDown'
  rankingTypeOptions = ['dropDown', 'dragAndDrop', 'radio']

  draggableBag
  isdropDown = true

  allowScrolling = true

  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar) {
    super(dragulaService, _snackBar)
  }

  ngOnInit(): void {
    this.rankingScaleValue = this.bmxItem.componentSettings[0].selectedRanking
    this.createRatingStars(this.rankingScaleValue)
    // this.rankingTableType( this.bmxItem.componentSettings[0].rankType)
    this.rankingType = this.bmxItem.componentSettings[0].rankType

    if (this.rankingType == 'dropDown') {
      this.draggableBag = ''
      this.isdropDown = true
    } else if (this.rankingType == 'dragAndDrop') {
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false

    } else if (this.rankingType == 'radio') {
      this.draggableBag = ''
      this.isdropDown = false
      this.radioColumnCounter = 1
    }



    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" && value != "RATE") {
        this.columnsNames.push(value)
      }
    });

  }

  checkDragEvetn(rows) {
    if (this.bmxItem.componentSettings[0].rankType == 'dragAndDrop') {
      rows.forEach((row , rowIndex) => {
       if (rowIndex > 0) {         
         row.RATE = rowIndex
       }
      })
    }
  }


  createRatingStars(ratingScale, ratingScaleIcon?) {
    let startCounter: any = []
    for (let index = 0; index < ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: index + 1,
        styleClass: 'rating-star'
      });
    }
    return startCounter;
  }

  upLoadNamesAndRationales(list: string) {
    this.dragRows = true;
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const rows = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split("\t");

      let nameCandidatesCounter = 0
      this.extraColumnCounter = 1
      // COLUMNS NAMES CHECK
      this.columnsNames.forEach((column, index) => {
        column = column.toLowerCase()
        if (nameCandidatesCounter == 0 && column.includes('candidates') || column == 'questions') {
          this.columnsNames[index] = 'nameCandidates'
          nameCandidatesCounter++
        } else
          if (column == 'name rationale' || column == 'rationale' || column == 'rationales') {
            this.columnsNames[index] = 'rationale'
          }
          else if (column == 'katakana') {
            this.columnsNames[index] = 'katakana'
          }
          else {
            this.columnsNames[index] = 'ExtraColumn' + this.extraColumnCounter
            this.extraColumnCounter++
          }
      });
      this.TESTNAMES_LIST = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != "" && rows[i].length > 6) {
          let objectColumnDesign = {};
          if (this.ASSIGNED_CRITERIA.length > 0) {

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
          } else {

            objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e]
              }
            }
          }

          this.TESTNAMES_LIST.push(objectColumnDesign);
        }
      }
      this.bmxItem.componentText = this.deleteDuplicates(this.TESTNAMES_LIST, 'nameCandidates');
      this.rankingTableType(this.bmxItem.componentSettings[0].rankType)

    } else {
      this.bmxItem.componentText.forEach((row, index) => {
        row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
      });
    }
    setTimeout(() => {
      this.dragRows = false;
    }, 1000);
    this.bmxItem.componentSettings[0].selectedRanking = this.rankingScaleValue
  }


  rankingTableType(rankingType) {
    this.bmxItem.componentSettings[0].rankType = rankingType
    let values = Object.keys(this.bmxItem.componentText[0])
    this.columnsNames = []
    this.RadioColumnList = []
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });
    this.columnsNames.forEach(columnName => {
      if (columnName.includes('RadioColumn')) {
        this.deleteColumn(columnName)
      }
    });
    if (rankingType == 'dropDown') {
      this.bmxItem.componentSettings[0].rateWidth = 120
      this.draggableBag = ''
      this.isdropDown = true
    } else if (rankingType == 'dragAndDrop') {
      this.bmxItem.componentSettings[0].rateWidth = 80
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false

    } else if (rankingType == 'radio') {
      this.bmxItem.componentSettings[0].rateWidth = 80
      this.draggableBag = ''
      this.isdropDown = false
      this.radioColumnCounter = 1
      for (let index = 0; index < this.rankingScaleValue; index++) {
        this.insertRadioColumn()
      }
    }
  }


  toggleScrolling() {
    this.allowScrolling = !this.allowScrolling
    if (this.allowScrolling) {
      window.onscroll = function () { };
    } else {
      var x = window.scrollX;
      var y = window.scrollY;
      window.onscroll = function () { window.scrollTo(x, y); };
    }

  }

  ASSIGNED_CRITERIA = []
  
}
