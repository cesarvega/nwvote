import { DragulaService } from 'ng2-dragula';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-image-rank',
  templateUrl: './image-rank.component.html',
  styleUrls: ['./image-rank.component.scss']
})

export class ImageRankComponent  extends RatingScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;

  isImageType = true

  rankingType = 'dropDown'
  rankingTypeOptions = ['dropDown', 'dragAndDrop', 'radio']

  draggableBag
  isdropDown = true

  allowScrolling = true

  VIDEO_PATH: any[] = [];
  showMatrixMenu: boolean = false;
  iconMenuShow: string = "add_circle_outline"
  PATH1: any[] = [
    'assets/img/bmx/tutorial/image-drag.JPG',
    
  ]

  PATH2: any[] = [
    'assets/img/bmx/tutorial/image-drag2.JPG',  
  ]

  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar, _bmxService: BmxService,public deviceService: DeviceDetectorService) {
    super(dragulaService, _snackBar, _bmxService,deviceService)
  }

  ngOnInit(): void {
    this.rankingScaleValue = this.bmxItem.componentSettings[0].selectedRanking
    this.createRatingStars(this.rankingScaleValue)
    // this.rankingTableType( this.bmxItem.componentSettings[0].rankType)
    this.rankingType = this.bmxItem.componentSettings[0].rankType

    this.rowsCount =  this.bmxItem.componentText.length - 1
    this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule == 0?this.rowsCount:this.bmxItem.componentSettings[0].minRule;
    this.bmxItem.componentSettings[0].maxRule = this.bmxItem.componentSettings[0].maxRule == 0?this.rowsCount:this.bmxItem.componentSettings[0].maxRule;

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

    if(window.innerWidth <= 1024){
      this.VIDEO_PATH = this.PATH1;
    }else{
      this.VIDEO_PATH = this.PATH2;
    }
  }

  checkDragEvetn(rows) {
    if (this.bmxItem.componentSettings[0].rankType == 'dragAndDrop') {
      rows.forEach((row, rowIndex) => {
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
    this.bmxItem.componentSettings[0].randomizeTestNames = (this.randomizeTestNames) ? true : false
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
      this.columnsNames.push('RATE')
    } else {
      this.bmxItem.componentText.forEach((row, index) => {
        row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
      });
    }

    setTimeout(() => {
      this.rowsCount = this.bmxItem.componentText.length - 1;
      
      if(this.newSet){
        this.bmxItem.componentSettings[0].minRule = this.rowsCount;
        this.bmxItem.componentSettings[0].maxRule = this.rowsCount;        
        this.newSet = false;
      }
      
      if (this.bmxItem.componentSettings[0].CRITERIA) {
        //MULTIPLY FOR THE AMOUNT OF CRITERIA
        this.bmxItem.componentSettings[0].minRule = this.bmxItem.componentSettings[0].minRule * this.bmxItem.componentText[0].CRITERIA.length
      }
      this.dragRows = false;
    }, 1000);

    this.rankingTableType(this.bmxItem.componentSettings[0].rankType)
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

  showMatrixMenuBmx(){
    this.showMatrixMenu = !this.showMatrixMenu;
      if(this.showMatrixMenu){
        this.iconMenuShow = "remove_circle_outline"
      }else{
        this.iconMenuShow = "add_circle_outline"
      }
  }
  

  ASSIGNED_CRITERIA = []

}
