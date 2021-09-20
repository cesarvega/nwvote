import { DragulaService } from 'ng2-dragula';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-rank-scale',
  templateUrl: './rank-scale.component.html',
  styleUrls: ['./rank-scale.component.scss']
})
export class RankScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  rankingScaleValue = 5;
  selectedIndex: any
  displayInstructions = false;
  isColumnResizerOn = false;

  selectedStarRatingIndex = ''
  selectedRating = '';
  columnsSlider = 358 
  rowHeightSlider = 1.5
  fontSizeRow = 19 
  rationalewidth = this.columnsSlider + 100 


  // CONFIGURATION VARIABLES
  testNamesInput: string
  TestNameDataModel: any[];
  ratingScale = 5;
  TESTNAMES_LIST = [];
  columnsNames = [];
  columnsNamesHeader: string[];
  listString: string;
  tempItems = [];
  selectedColumn
  ratingScaleIcon = 'grade';
  selectedRank
  nativeSelectFormControl

  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('DRAGGABLE_ROW', {

    });
   }
  ngOnInit(): void {
    console.log('');
    
    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS") {
        this.columnsNames.push(value)
      }
    });

    // INITIAL COLUMNS SETTINGS
    this.columnsSlider = (this.bmxItem.componentSettings[0].columnWidth)?this.bmxItem.componentSettings[0].columnWidth:this.columnsSlider
    this.rowHeightSlider = this.bmxItem.componentSettings[0].columnHeight
    this.fontSizeRow = this.bmxItem.componentSettings[0].fontSize

    // this.columnsNames = Object.values(this.bmxItem.componentText[0])
  }

  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
  setRating(starId, testNameId) {
    this.bmxItem.componentText[testNameId].RATE = starId
  }

  selectStar(starId, testNameId): void {
    this.bmxItem.componentText[testNameId].STARS.filter((star) => {
      if (star.id <= starId) {

        star.class = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';

      } else {

        star.class = 'rating-star';

      }
      return star;
    });
  }

  leaveStar(testNameId): void {
    this.selectedRating = this.bmxItem.componentText[testNameId].RATE
    this.bmxItem.componentText[testNameId].STARS.filter((star) => {
      if (star.id <= this.selectedRating && this.selectedRating !== "") {
        star.class = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';
      } else {
        star.class = 'rating-star';
      }
      return star;
    });
  }

  createRatingStars(ratingScale, ratingScaleIcon) {
    let startCounter: any = []
    for (let index = 0; index < ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: index + 1,
        class: 'rating-star'
      });
    }
    return startCounter;
  }

  
  // PRIVATE METHODS


  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ END STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️


  upLoadNamesAndRationales(list: string) {
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const textAreaInput = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = textAreaInput[0].toLowerCase().split("\t");
      // textAreaInput.splice(0,1);
      this.TESTNAMES_LIST = [];
      for (var i = 0; i < textAreaInput.length; i++) {
        if (textAreaInput[i] != "" && textAreaInput[i].length > 6) {
          let objectColumnDefiner = {};
          objectColumnDefiner['STARS'] = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon);
          for (var e = 0; e < this.columnsNames.length; e++) {
            if ((textAreaInput[i].split("\t").length > 0)) {
              objectColumnDefiner[this.columnsNames[e]] = textAreaInput[i].split("\t")[e];
            }
          }
          this.TESTNAMES_LIST.push(objectColumnDefiner);
        }
      }
      this.bmxItem.componentText = this.TESTNAMES_LIST;
    } else {
      this.bmxItem.componentText.forEach((row, index) => {
        row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
        this.bmxItem.componentText[index].RATE = undefined
        // this.leaveStar(index);
      });
    }
  }

  // COLUMNS ADD AND REMOVE
  insertNewColumn() {
    var count = 0;
    for (var k in this.bmxItem.componentText[0]) {
      if (this.bmxItem.componentText[0].hasOwnProperty(k)) {
        ++count;
      }
    }
    this.columnsNames.push('Custom ' + (count - 1));
    this.bmxItem.componentText.forEach((object, index) => {
      this.bmxItem.componentText[index] = this.addToObject(object, 'Custom ' + (count - 1), 'Custom ' + (count - 1), count - 1)
    });
  }

  deletRow(option): void {
    this.bmxItem.componentText.splice(option, 1);
  }

  deleteColumn(columnName) {
    let temporary = []
    // REMOVE THE COLUMN FROM THE COLUMNS
    this.columnsNames.forEach(element => {
      if (element !== columnName) {
        temporary.push(element)
      }
    });
    this.columnsNames = temporary;
    this.bmxItem.componentText.forEach((object, index) => {
      delete this.bmxItem.componentText[index][columnName]
    });
    this.bmxItem.componentText = this.bmxItem.componentText;
  }



  checkDragEvetn(e) {
    console.log(e);
  }

  private addToObject(obj, key, value, index) {
    // Create a temp object and index variable
    let temp = {};
    let i = 0;
    // Loop through the original object
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {

        // If the indexes match, add the new item
        if (i === index && key && value) {
          temp[key] = value;
        }
        // Add the current item in the loop to the temp obj
        temp[prop] = obj[prop];
        // Increase the count
        i++;
      }
    }

    // If no index, add to the end
    if (!index && key && value) {
      temp[key] = value;
    }

    return temp;

  };



  // INOUT RANGE CONTROLS AND FONT SIZE
  setRationalewidth(rationalewidth) {
    this.bmxItem.componentSettings[0].rationalewidth = rationalewidth
  }

  setFontSize(fontSize) {
    this.bmxItem.componentSettings[0].fontSize = fontSize
  }

  setColumnWidth(columnWidth) {
    this.bmxItem.componentSettings[0].columnWidth = columnWidth
  }

  setSMALLTextLengthColumnHeight(columnHeight) {
    this.bmxItem.componentSettings[0].columnHeight = columnHeight
  }
  
  toogleColumnResizer() {
    this.isColumnResizerOn = !this.isColumnResizerOn
  }

  ASSIGNED_CATEGORIES = [{name:'Fit to Company Description', rate:0},
  {name:'Fit to Product Statement', rate:0},
  {name:'Fit to Product Overview', rate:0},
  {name:'Fit to Global Positioning', rate:0}]
  CRITERIAS = [   
    {name:'Fit to Company Description', rate:0},
    {name:'Fit to Product Statement', rate:0},
    {name:'Fit to Product Overview', rate:0},
    {name:'Fit to Global Positioning', rate:0},
    {name:'Fit to Concept/Positioning', rate:0},
    {name:'Fit to Brand Vision', rate:0},
    {name:'Fit to Vision Statement or Product Description', rate:0},
    {name:'Fit to Product Concept/Description', rate:0},
    {name:'Fit to Product Line Concept', rate:0},
    {name:'Fit to Global Concept', rate:0},
    {name:'Fit to Program Concept', rate:0},
    {name:'Fit to Therapeutic Area', rate:0},
    {name:'Fit to Service Positioning', rate:0},
    {name:'Fit to Product Description', rate:0},
    {name:'Fit to Venue Concept', rate:0},
    {name:'Fit to Program Description', rate:0},
    {name:'Fit to Program Vision', rate:0},
    {name:'Fit to Value Proposition', rate:0},
    {name:'Fit to Technology Concept', rate:0},
    {name:'Fit to Vision', rate:0},
    {name:'Product Positioning', rate:0},
    {name:'Fit to Product Concept and Positioning', rate:0},
    {name:'Fit to Concept Statement', rate:0},
    {name:'Fit to Division Concept', rate:0},
    {name:'Fit to Mechanism of Action', rate:0},
    {name:'Fit to Brand Concept', rate:0},
    {name:'Fit to Product Range Concept', rate:0},
    {name:'Fit to Concept', rate:0},
    {name:'Fit to Trial Concept', rate:0},
    {name:'Fit to Product Features and Benefits', rate:0},
    {name:'Fit to Brand', rate:0},
    {name:'Fit to Company Concept', rate:0},
    {name:'S`adapter au Concept de produit', rate:0},
    {name:'Fit to Compound Concept', rate:0},
    {name:'Fit to Service Concept', rate:0},
    {name:'Fit to Product Vision', rate:0},
    {name:'Fit to Contract Concept', rate:0},
    {name:'Fit to Product', rate:0},
    {name:'Fit to Brand Essence', rate:0},
    {name:'Fit to Entity Objectives', rate:0},
    {name:'Brand Family Rankings', rate:0},
    {name:'Fit to Trial Overview', rate:0},
    {name:'Fit to Business Unit Concept', rate:0},
    {name:'Fit to X4P-001 WHIM Syndrome Program', rate:0},
    {name:'Fit to Product Positioning', rate:0},
    {name:'Fit to LEO Pharma Mission and Vision', rate:0},
    {name:'Fit to Product Profile', rate:0},
    {name:'Fit to Positioning', rate:0},
    {name:'Fit to Company Mission', rate:0},
    {name:'Fit to Therapy', rate:0},
    {name:'Fit to Class Concept', rate:0},
    {name:'• S`adapter au Concept de produit', rate:0},
    {name:'Fit to Product Concept/S`adapter au Concept de produit', rate:0},
    {name:'Fit to Portfolio Concept', rate:0},
    {name:'Fit to Mission and Vision Statements', rate:0},
    {name:'Overall Feasibility', rate:0},
    {name:'Fit to Company Description/Mission', rate:0},
    {name:'Fit to Compound Character and Image', rate:0},
    {name:'Fit to Strategy', rate:0},
    {name:'Personal Preference', rate:0},
    {name:'OPSIRIA Likeness', rate:0},
    {name:'Appropriately describes the Flutiform breath triggered inhaler', rate:0},
    {name:'Overall strategic fit and likeability', rate:0},
    {name:'Uniqueness', rate:0},
    {name:'Fit to Category Concept', rate:0},
    {name:'Overall Preference', rate:0},
    {name:'Connection to Hemlibra', rate:0},
    {name:'Fit to Company Vision Statement', rate:0},
    {name:'Fit to Website Concept', rate:0},
    {name:'Dislike', rate:0},
    {name:'Like', rate:0},
    {name:'Negative/Offensive Communication', rate:0},
    {name:'Fit to Phase 2/3 HTE Trial', rate:0},
    {name:'Fit to Phase 2 VS Trial', rate:0},
    {name:'Exaggerative/Inappropriate Claim', rate:0},
    {name:'Fit to Product Concept', rate:0},
    {name:'Attribute Evaluations', rate:0},
    {name:'Memorability', rate:0},
    {name:'Overall Likeability', rate:0},
    {name:'How the test name works alongside the name CUVITRU?', rate:0},
  ]

}
