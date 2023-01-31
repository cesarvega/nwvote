import { DragulaService } from 'ng2-dragula';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BmxService } from '../../../bmx.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';

@Component({
  selector: 'app-tinder',
  templateUrl: './tinder.component.html',
  styleUrls: ['./tinder.component.scss']
})
export class TinderComponent extends RatingScaleComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;

  value = 0;
  xpercent: number = 0;
  showModalTable: boolean = false;
  showModalAddRow: boolean = false;
  showNeutralIcon: boolean = false;
  showNewInput: boolean = false;
  hasVoted: boolean = false;

  newCandidate: any = {
    "nameCandidates": "",
    "rationale": ""
  }

  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;

  @Output() launchPathModal = new EventEmitter();

  PATH1: any[] = [
    'assets/img/bmx/tutorial/tutorial-tinder1.JPG',
    'assets/img/bmx/tutorial/tutorial-tinder2.JPG',    
  ]

  rankingType = 'dropDown'
  rankingTypeOptions = ['dropDown', 'dragAndDrop', 'radio']

  draggableBag
  isdropDown = true

  allowScrolling = true

  testNameIndex = 1

  dataSource: any[]=[]
  displayedColumns: string[] = ['nameCandidates', 'rationale','delete'];

  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar,   _bmxService: BmxService,public deviceService: DeviceDetectorService,public dialog: MatDialog) {
    super(dragulaService, _snackBar, _bmxService,deviceService)

  }
  ngOnInit(): void {
    this.getDataSource()    
    this.xpercent = 100 / (this.bmxItem.componentText.length - 1);
    this.value = this.xpercent;
    this.rankingScaleValue = this.bmxItem.componentSettings[0].selectedRanking
    this.ratingScale = this.bmxItem.componentSettings[0].selectedRanking
    this.createRatingStars(this.ratingScale)
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
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA") {
        this.columnsNames.push(value)
      }
    });
    this.randomizeTestNames = this.bmxItem.componentSettings[0].randomizeTestNames

    if (this.bmxItem.componentSettings[0]['displaySound'] == true) {
      this.displaySound = true;
    }
    this.VIDEO_PATH = this.PATH1;
    this.launchPathModal.emit(this.VIDEO_PATH)
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
    this.bmxItem.componentSettings[0].randomizeTestNames = (this.randomizeTestNames) ? true : false
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const rows = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split("\t");

      this.extraColumnCounter = 1
      this.columnsNames.forEach((column, index) => {
        if (column == 'name candidates' || column == 'test names' || column == 'names' || column == 'name') {
          this.columnsNames[index] = 'nameCandidates'
        } else if (column == 'name rationale' || column == 'rationale' || column == 'rationales') {
          this.columnsNames[index] = 'rationale'
        } else if (column == 'katakana') {
          this.columnsNames[index] = 'katakana'
        } else {
          this.columnsNames[index] = 'ExtraColumn' + this.extraColumnCounter
          this.extraColumnCounter++
        }
      });
      this.TESTNAMES_LIST = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != "" && rows[i].length > 6) {
          let objectColumnDesign = {};
            objectColumnDesign['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e].trim()
              }
            }
          this.TESTNAMES_LIST.push(objectColumnDesign);
        }
      }
      this.bmxItem.componentText = this.TESTNAMES_LIST;
      this.rankingTableType(this.bmxItem.componentSettings[0].rankType)

    } else {
      this.bmxItem.componentText.forEach((row, index) => {
        row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
      });
    }
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
      this.draggableBag = ''
      this.isdropDown = true
    } else if (rankingType == 'dragAndDrop') {
      this.draggableBag = 'DRAGGABLE_RANK_ROW'
      this.isdropDown = false

    } else if (rankingType == 'radio') {
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


  voteName(vote) {
    this.bmxItem.componentText[this.testNameIndex]['vote'] = vote
   
    this.hasVoted = true
    setTimeout(() => {
      // this.moveRight()
    }, 1000);
  }

  resetVotes() {
    if (confirm('Are you sure you want to reset the votes?')) {
      this.bmxItem.componentText.forEach((row, index) => {
        if (index>0) {
          row['vote'] = undefined
        }
      });
    }
  }

  moveRight(testName:string) {   

    if(this.value <= 100){
      this.value = this.value + this.xpercent;
      if (this.testNameIndex < this.bmxItem.componentText.length - 1) {
        
        this.testNameIndex++

        if(this.bmxItem.componentText[this.testNameIndex]['vote'] != undefined){
          this.hasVoted = true;      
        }else{
          this.hasVoted = false; 
        }

        this.bmxItem.componentText[this.testNameIndex].comments = this.bmxItem.componentText[this.testNameIndex].comments
      }      
    }    
    
  }

  moveleft(testName:string) {
    if (1 < this.testNameIndex) {
      this.value = this.value - this.xpercent;
      this.testNameIndex--
      if(this.bmxItem.componentText[this.testNameIndex]['vote'] != undefined){
        this.hasVoted = true;      
      }else{
        this.hasVoted = false; 
      }
      this.bmxItem.componentText[this.testNameIndex].comments = this.bmxItem.componentText[this.testNameIndex].comments
    }
  }  
  
  uploadNames(){
    this.bmxItem.componentText.push(this.newCandidate)
    this.dataSource.push(this.newCandidate)
    this.newCandidate.nameCandidates = "";
    this.newCandidate.rationale = "";
    this.showModalAddRow = false;
  }

  deleteName(element: any){  
    let x  
    x =  this.bmxItem.componentText.splice(this.bmxItem.componentText.indexOf(element), 1);
   
    if(x[0].nameCandidates == element.nameCandidates){
      this.dataSource.splice(this.dataSource.indexOf(element), 1);      
    }

    this.table.renderRows();
  }

  getDataSource(){
    this.dataSource = this.bmxItem.componentText.slice(1)
  }

}

