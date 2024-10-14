import { DragulaService } from 'ng2-dragula';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


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
  @Input() bmxPages
  @Input() currentPage
  @Output() autoSave = new EventEmitter();
  showBar = false

  CREATION_VIDEO_PATH = "assets/videos/RankMatrix.mp4"
  VIDEO_PATH: any[] = [];

  PATH1: any[] = [
    'assets/img/bmx/tutorial/image-drag.JPG',
  ]

  PATH2: any[] = [
    'assets/img/bmx/tutorial/image-drag2.JPG',
  ]
  isImageType = true

  rankingType = 'dropDown'
  rankingTypeOptions = ['dropDown', 'dragAndDrop', 'radio', 'dinamycRadio']

  draggableBag
  isdropDown = true

  allowScrolling = true
  dataSource: any[] = []

  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar, _bmxService: BmxService, public deviceService: DeviceDetectorService) {
    super(dragulaService, _snackBar, _bmxService, deviceService)
  }

  ngOnInit(): void {
    this.showDialog = false
    console.log(this.bmxItem)
    this.rankingScaleValue = this.bmxItem.componentSettings[0].selectedRanking
    this.createRatingStars(this.rankingScaleValue)
    // this.rankingTableType( this.bmxItem.componentSettings[0].rankType)
    this.rankingType = this.bmxItem.componentSettings[0].rankType
    this.rankingType = 'dinamycRadio' //HARD CODE

    this.rowsCount = this.bmxItem.componentText.length - 1;

    if (this.rankingType == 'dropDown') {
      this.draggableBag = ''
      this.isdropDown = true
    } else if (this.rankingType == 'dragAndDrop') {
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false

    } else if (this.rankingType == 'radio' || this.rankingType == 'dinamycRadio') {
      this.draggableBag = ''
      this.isdropDown = false
      this.radioColumnCounter = 1
    }

    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" && value != 'RATE') {
        this.columnsNames.push(value)
      }
    });
    //this.columnsNames.push("RadioColumn4", "RadioColumn5");//HARD CODE

    let result = '';

    let firstObject = this.bmxItem.componentText[0];
    console.log(firstObject)
    let columnNames = [];
    for (let key in firstObject) {
      if (key === 'Name Candidates' || key === 'Rationales') {
        columnNames.push(key);
      }
    }
    for (let obj of this.bmxItem.componentText) {
      let values = [];
      for (let key in obj) {

        if (key !== 'STARS' && key !== 'RATE' && key !== 'CRITERIA' && !key.includes('Comments')) {
          if (isNaN(Number(obj[key]))) {
            values.push(obj[key]);
          }
        }
      }
      if (values.length > 0) {
        result += values.join('\t') + '\n';
      }
    }

    this.testNamesInput = result;
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames


    // HANDLIN SPECIAL REQUEST
    if (this.bmxItem.componentSettings[1]) {
      if (this.bmxItem.componentSettings[1].isImageType && !this.bmxClientPageOverview) {
        this._bmxService.specialDataObservable$.subscribe((arg: any) => {
          this.bmxItem.componentSettings[1].categoryTobeRender = 'Category ' + arg.tesName
        });

      }
    } else {
      this.bmxItem.componentSettings.push({
        isImageType: false,
        categoryTobeRender: '',
        isSpecialRquest: false,
      })
    }

    if (this.bmxItem.componentSettings[0]['displaySound'] == true) {
      this.displaySound = true;
    }
    const filteredCriteria = this.CRITERIA.filter(criteriaItem => this.selectedCriteria.map(item => item.name).includes(criteriaItem.name));
    this.newselectedCriteria = filteredCriteria
    this.rankingScaleValue = this.bmxItem.componentText[0].STARS.length;
    this.dataSource = this.bmxItem.componentText
    this.recordHistory();

    
  }
  sortAlphabetically() {
    console.log(this.bmxItem.componentText)
    const firstElement = this.bmxItem.componentText[0];

    const sortedRest = this.bmxItem.componentText.slice(1).sort((a, b) => {
      return a.nameCandidates.localeCompare(b.nameCandidates);
    });

    this.bmxItem.componentText = [firstElement, ...sortedRest];
}
checkDragEvetnType(event: CdkDragDrop<string[]>) {
  if (event.previousIndex > 0 && event.currentIndex > 0) {
    moveItemInArray(this.bmxItem.componentText, event.previousIndex, event.currentIndex);

    this.autoSave.emit()
  }
  this.dataSource=this.bmxItem.componentText
  this.autoSave.emit()
}

moveItemUp(): void {
  if (this.i > 0) {
      const temp = this.bmxPages[this.currentPage].page[this.i];
      this.bmxPages[this.currentPage].page[this.i] = this.bmxPages[this.currentPage].page[this.i - 1];
      this.bmxPages[this.currentPage].page[this.i - 1] = temp;
  }
}

moveItemDown(): void {
  if (this.i < this.bmxPages[this.currentPage].page.length - 1) {
      const temp = this.bmxPages[this.currentPage].page[this.i];
      this.bmxPages[this.currentPage].page[this.i] = this.bmxPages[this.currentPage].page[this.i + 1];
      this.bmxPages[this.currentPage].page[this.i + 1] = temp;
  }
}

  checkDragEvetn(event: CdkDragDrop<string[]>) {
    if (event.previousIndex > 0 && event.currentIndex > 0) {
      moveItemInArray(this.bmxItem.componentText, event.previousIndex, event.currentIndex);

      this.autoSave.emit()
    }
    this.dataSource=this.bmxItem.componentText
    this.autoSave.emit()
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
  upLoadNamesAndRationales(list: any, dataSourceCopy: any, update?:boolean) {
    
    this.bmxItem.componentText = dataSourceCopy
    this.dataSource = dataSourceCopy
    if (typeof list == 'object') {
      list = ''
    }
    this.uploadImagesIcon = true;
    this.bmxItem.componentSettings[0].randomizeTestNames = this.randomizeTestNames ? true : false;
    if (update) {
      this.recordHistory();
    }
    this.dragRows = true;
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const rows = list.split("\n");

      let nameCandidatesCounter = 0;
      this.extraColumnCounter = 1;

      // COLUMNS NAMES CHECK
      const rateColumnIndex = this.columnsNames.findIndex(column => column === 'RATE');
      console.log(rateColumnIndex + "este es el rateco")
      if (rateColumnIndex !== -1) {
        this.columnsNames.splice(rateColumnIndex, 1);
      }

      this.columnsNames.forEach((column, index) => {
        column = column.toLowerCase();
        if (nameCandidatesCounter == 0 && column.includes('candidates') || column == 'questions') {
          nameCandidatesCounter++;
        } else if (column == 'name rationale' || column == 'rationale' || column == 'rationales') {
          // Logic for rationale columns
        } else if (column == 'katakana') {
          // Logic for katakana column
        } else {
          if (this.bmxItem.componentSettings[0].rankType != 'radio' || this.bmxItem.componentSettings[0].rankType != 'dinamycRadio') {
            this.extraColumnCounter++;
          }
        }
      });

      const originalRatePosition = rateColumnIndex !== -1 ? rateColumnIndex : this.columnsNames.length;

      if (rateColumnIndex != -1) {
        this.columnsNames.splice(originalRatePosition, 0, 'RATE');
      }

      this.TESTNAMES_LIST = [];
      if (rateColumnIndex != -1) {
        this.autoSizeColumns('RATE', '', this.rankingScaleValue);
      }

      // TEST NAMES CHECK
      let index = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != "" && rows[i].length > 6) {
          let objectColumnDesign = {};
          if (this.ASSIGNED_CRITERIA.length > 0) { // CRITERIA
            this.bmxItem.componentSettings[0].CRITERIA = true;
            this.bmxItem.componentSettings[0].rateWidth = (this.bmxItem.componentSettings[0].rateWidth < 220) ? 220 : this.bmxItem.componentSettings[0].rateWidth;

            for (let e = 0; e < this.columnsNames.length; e++) {
              if (rows[i].split("\t").length > 0) {
                const columnName = this.columnsNames[e];
                let columnValue;
                if (this.bmxItem.componentText.length > i && columnName == 'nameCandidates') {
                  columnValue = this.bmxItem.componentText[i].nameCandidates == "LOGO" ? this.bmxItem.componentText[i].nameCandidates : rows[i].split("\t")[e].trim();
                } else {
                  columnValue = rows[i].split("\t")[e] ? rows[i].split("\t")[e].trim() : '';
                }
                objectColumnDesign[columnName] = columnValue;
                if (i != 0) {
                  this.autoSizeColumns(columnName, columnValue);
                }
              }
            }

            if (rateColumnIndex != -1) {
              objectColumnDesign['RATE'] = i > 0 ? -1 : 'RATE';
            } objectColumnDesign['CRITERIA'] = [];
            this.ASSIGNED_CRITERIA.forEach((criteria, index) => {
              objectColumnDesign['CRITERIA'].push({
                name: criteria.name,
                STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                RATE: -1,
              });
            });
          } else {
            this.bmxItem.componentSettings[0].CRITERIA = false;
            objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
            for (let e = 0; e < this.columnsNames.length; e++) {
              if (rows[i].split("\t").length > 0) {
                const columnName = this.columnsNames[e];
                let columnValue;
                if (this.bmxItem.componentText.length > i && columnName == 'nameCandidates') {
                  columnValue = this.bmxItem.componentText[i].nameCandidates == "LOGO" ? this.bmxItem.componentText[i].nameCandidates : rows[i].split("\t")[e].trim();
                } else {
                  columnValue = rows[i].split("\t")[e] ? rows[i].split("\t")[e].trim() : '';
                }
                objectColumnDesign[columnName] = columnValue;
                if (i != 0) {
                  this.autoSizeColumns(columnName, columnValue);
                }
              }
            }
          }
          if (rateColumnIndex != -1) {
            objectColumnDesign['RATE'] = i > 0 ? -1 : 'RATE';
          }
          objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
          for (let b = 0; b < this.columnsNames.length; b++) {
            if (rows[i].split("\t").length > 0 && this.columnsNames[b] !== 'nameCandidates') {
              objectColumnDesign[this.columnsNames[b]] = rows[i].split("\t")[b];
            }
          }
          if (this.bmxItem.componentType == 'narrow-down') {
            objectColumnDesign['SELECTED_ROW'] = false;
          }
          const newObj = {};

          for (const key in this.bmxItem.componentText[1]) {
            if (this.bmxItem.componentText[1].hasOwnProperty(key) && key.startsWith("Comments")) {
              objectColumnDesign[key] = "";
            }
          }

          for (const key in objectColumnDesign) {
            if (objectColumnDesign.hasOwnProperty(key) && !key.includes("Comments")) {
              newObj[key] = objectColumnDesign[key];
            }
          }

          for (const key in objectColumnDesign) {
            if (objectColumnDesign.hasOwnProperty(key) && key.includes("Comments")) {
              newObj[key] = index == 0 ? this.bmxItem.componentText[0][key] : '';
            }
          }
          this.TESTNAMES_LIST.push(newObj);
          index++;
        }
      }
      if (this.ASSIGNED_CRITERIA.length > 0) { // CRITERIA
        this.bmxItem.componentText.forEach((row, index) => {
          let CRITERIA = [];
          this.ASSIGNED_CRITERIA.forEach(criteria => {
            CRITERIA.push({
              name: criteria.name,
              STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
              RATE: index > 0 ? -1 : row.RATE,
            });
          });
          row.CRITERIA = CRITERIA;
          delete row["'STARS'"];
        });
      } else {
        this.bmxItem.componentText.forEach((row, index) => {
          if (rateColumnIndex != -1) {
            row.RATE = index > 0 ? -1 : row.RATE;
          }
          row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
          delete row['CRITERIA'];
        });
      }
      this.removeAllRadioColumns();
      if (this.bmxItem.componentSettings[0].rankType == 'radio' || this.bmxItem.componentSettings[0].rankType == 'dinamycRadio' ) {
        for (let index = 0; index < this.rankingScaleValue; index++) {
          this.insertRadioColumn();
        }
      }
      this.dataSource = this.bmxItem.componentText;

    } else {
      this.autoSizeColumns('RATE', '', this.rankingScaleValue);
      if (this.ASSIGNED_CRITERIA.length > 0) {
        this.bmxItem.componentSettings[0].CRITERIA = true;
        this.bmxItem.componentText.forEach((row, index) => {
          let CRITERIA = [];
          this.ASSIGNED_CRITERIA.forEach(criteria => {
            CRITERIA.push({
              name: criteria.name,
              STARS: this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
              RATE: index > 0 ? -1 : 'RATE',
            });
          });
          row.CRITERIA = CRITERIA;
          delete row["'STARS'"];
        });
      } else {
        this.bmxItem.componentSettings[0].CRITERIA = false;
        this.bmxItem.componentText.forEach((row, index) => {
          row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
          row.RATE = index > 0 ? -1 : 'RATE';
          delete row['CRITERIA'];
        });
      }
    }

    setTimeout(() => {
      this.rowsCount = this.bmxItem.componentText.length - 1;

      if (this.newSet) {
        this.bmxItem.componentSettings[0].minRule = this.rowsCount;
        this.bmxItem.componentSettings[0].maxRule = this.rowsCount;
        this.newSet = false;
      }

      if (this.bmxItem.componentSettings[0].CRITERIA) {
        this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule;
        this.bmxItem.componentSettings[0].maxRule = this.bmxItem.componentSettings[0].maxRule;
      }

      this.dragRows = false;
    }, 0);
    
    this.bmxItem.componentText = this.dataSource
    if (this.alphabeticallyTestNames) {
      this.sortAlphabetically()
    }
  }

  rankingTableType(rankingType) {
    this.bmxItem.componentSettings[0].rankType = rankingType
    let values = Object.keys(this.bmxItem.componentText[0])
    this.columnsNames = []
    this.RadioColumnList = []
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" && value != "RATE") {
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

    }
     if (rankingType == 'radio' || rankingType == 'dinamycRadio') {
      this.bmxItem.componentSettings[0].rateWidth = 120
      this.draggableBag = ''
      this.isdropDown = false
      this.radioColumnCounter = 1
      this.rowsCount = this.bmxItem.componentText.length - 1;
      for (let index = 0; index < this.rankingScaleValue; index++) {
      this.insertRadioColumn()
      }
    }
    console.log(this.bmxItem.componentText)
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
