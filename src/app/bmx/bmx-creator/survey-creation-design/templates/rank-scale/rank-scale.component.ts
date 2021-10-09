import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';

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
  rankingTypeOptions = [ 'dropDown' , 'dragAndDrop', 'radio' ]

  draggableBag
  isdropDown = true

  allowScrolling = true

  constructor(dragulaService: DragulaService) {
   super(dragulaService)
   
   }
   ngOnInit(): void {
    this.rankingScaleValue = this.bmxItem.componentSettings[0].selectedRanking
   this.ratingScale = this.bmxItem.componentSettings[0].selectedRanking
    this.createRatingStars( this.ratingScale)
    // this.rankingTableType( this.bmxItem.componentSettings[0].rankType)
    this.rankingType = this.bmxItem.componentSettings[0].rankType

    if (this.rankingType == 'dropDown' ) {
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
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" ) {
        this.columnsNames.push(value)
      }
    });

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
          } else if (column == 'name rationale' || column == 'rationale' || column == 'rationales')  {
            this.columnsNames[index] = 'rationale'
          } else if (column == 'katakana')  {
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
          if (this.ASSIGNED_CRITERIA.length > 0) {

            for (let e = 0; e < this.columnsNames.length; e++) {
              if ((rows[i].split("\t").length > 0)) {
                objectColumnDesign[this.columnsNames[e]] = rows[i].split("\t")[e]
              }
            }
            objectColumnDesign['CRITERIA'] = []
            this.ASSIGNED_CRITERIA.forEach(criteria => {
              objectColumnDesign['CRITERIA'].push({
                name : criteria.name,
                STARS : this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon),
                RATE : -1,
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
      this.bmxItem.componentText = this.TESTNAMES_LIST;
      this.rankingTableType( this.bmxItem.componentSettings[0].rankType)
     
    } else {
      this.bmxItem.componentText.forEach((row, index) => {
        row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
      });
    }
  }


  rankingTableType(rankingType){
    this.bmxItem.componentSettings[0].rankType = rankingType
    let values = Object.keys(this.bmxItem.componentText[0])
    this.columnsNames = []
    this.RadioColumnList = []
    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" ) {
        this.columnsNames.push(value)
      }
    });
    this.columnsNames.forEach(columnName => {
      if (columnName.includes('RadioColumn')) {
        this.deleteColumn(columnName)
      }
    });
    if (rankingType == 'dropDown' ) {
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


  toggleScrolling(){
    this.allowScrolling = !this.allowScrolling
    if (this.allowScrolling) {
      window.onscroll=function(){};      
    } else {
      var x=window.scrollX;
      var y=window.scrollY;
      window.onscroll=function(){window.scrollTo(x, y);};
    }
   
  }

 

  ASSIGNED_CRITERIA = []
  CRITERIA = [
    { name: 'Fit to Company Description', rate: 0 },
    { name: 'Fit to Product Statement', rate: 0 },
    { name: 'Fit to Product Overview', rate: 0 },
    { name: 'Fit to Global Positioning', rate: 0 },
    { name: 'Fit to Concept/Positioning', rate: 0 },
    { name: 'Fit to Brand Vision', rate: 0 },
    { name: 'Fit to Vision Statement or Product Description', rate: 0 },
    { name: 'Fit to Product Concept/Description', rate: 0 },
    { name: 'Fit to Product Line Concept', rate: 0 },
    { name: 'Fit to Global Concept', rate: 0 },
    { name: 'Fit to Program Concept', rate: 0 },
    { name: 'Fit to Therapeutic Area', rate: 0 },
    { name: 'Fit to Service Positioning', rate: 0 },
    { name: 'Fit to Product Description', rate: 0 },
    { name: 'Fit to Venue Concept', rate: 0 },
    { name: 'Fit to Program Description', rate: 0 },
    { name: 'Fit to Program Vision', rate: 0 },
    { name: 'Fit to Value Proposition', rate: 0 },
    { name: 'Fit to Technology Concept', rate: 0 },
    { name: 'Fit to Vision', rate: 0 },
    { name: 'Product Positioning', rate: 0 },
    { name: 'Fit to Product Concept and Positioning', rate: 0 },
    { name: 'Fit to Concept Statement', rate: 0 },
    { name: 'Fit to Division Concept', rate: 0 },
    { name: 'Fit to Mechanism of Action', rate: 0 },
    { name: 'Fit to Brand Concept', rate: 0 },
    { name: 'Fit to Product Range Concept', rate: 0 },
    { name: 'Fit to Concept', rate: 0 },
    { name: 'Fit to Trial Concept', rate: 0 },
    { name: 'Fit to Product Features and Benefits', rate: 0 },
    { name: 'Fit to Brand', rate: 0 },
    { name: 'Fit to Company Concept', rate: 0 },
    { name: 'S`adapter au Concept de produit', rate: 0 },
    { name: 'Fit to Compound Concept', rate: 0 },
    { name: 'Fit to Service Concept', rate: 0 },
    { name: 'Fit to Product Vision', rate: 0 },
    { name: 'Fit to Contract Concept', rate: 0 },
    { name: 'Fit to Product', rate: 0 },
    { name: 'Fit to Brand Essence', rate: 0 },
    { name: 'Fit to Entity Objectives', rate: 0 },
    { name: 'Brand Family Rankings', rate: 0 },
    { name: 'Fit to Trial Overview', rate: 0 },
    { name: 'Fit to Business Unit Concept', rate: 0 },
    { name: 'Fit to X4P-001 WHIM Syndrome Program', rate: 0 },
    { name: 'Fit to Product Positioning', rate: 0 },
    { name: 'Fit to LEO Pharma Mission and Vision', rate: 0 },
    { name: 'Fit to Product Profile', rate: 0 },
    { name: 'Fit to Positioning', rate: 0 },
    { name: 'Fit to Company Mission', rate: 0 },
    { name: 'Fit to Therapy', rate: 0 },
    { name: 'Fit to Class Concept', rate: 0 },
    { name: '• S`adapter au Concept de produit', rate: 0 },
    { name: 'Fit to Product Concept/S`adapter au Concept de produit', rate: 0 },
    { name: 'Fit to Portfolio Concept', rate: 0 },
    { name: 'Fit to Mission and Vision Statements', rate: 0 },
    { name: 'Overall Feasibility', rate: 0 },
    { name: 'Fit to Company Description/Mission', rate: 0 },
    { name: 'Fit to Compound Character and Image', rate: 0 },
    { name: 'Fit to Strategy', rate: 0 },
    { name: 'Personal Preference', rate: 0 },
    { name: 'OPSIRIA Likeness', rate: 0 },
    { name: 'Appropriately describes the Flutiform breath triggered inhaler', rate: 0 },
    { name: 'Overall strategic fit and likeability', rate: 0 },
    { name: 'Uniqueness', rate: 0 },
    { name: 'Fit to Category Concept', rate: 0 },
    { name: 'Overall Preference', rate: 0 },
    { name: 'Connection to Hemlibra', rate: 0 },
    { name: 'Fit to Company Vision Statement', rate: 0 },
    { name: 'Fit to Website Concept', rate: 0 },
    { name: 'Dislike', rate: 0 },
    { name: 'Like', rate: 0 },
    { name: 'Negative/Offensive Communication', rate: 0 },
    { name: 'Fit to Phase 2/3 HTE Trial', rate: 0 },
    { name: 'Fit to Phase 2 VS Trial', rate: 0 },
    { name: 'Exaggerative/Inappropriate Claim', rate: 0 },
    { name: 'Fit to Product Concept', rate: 0 },
    { name: 'Attribute Evaluations', rate: 0 },
    { name: 'Memorability', rate: 0 },
    { name: 'Overall Likeability', rate: 0 },
    { name: 'How the test name works alongside the name CUVITRU?', rate: 0 },
  ]


}
