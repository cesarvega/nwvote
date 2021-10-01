import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-rating-scale',
  templateUrl: './rating-scale.component.html',
  styleUrls: ['./rating-scale.component.scss']
})
export class RatingScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  rankingScaleValue = 5;
  selectedIndex: any
  displayInstructions = false;
  isColumnResizerOn = true;

  selectedStarRatingIndex = ''
  selectedRating = '';
  editSingleTableCells = false
  // columnsSlider = 150
  // rowHeightSlider = 2
  // fontSizeRow = 19
  // rationalewidth = this.columnsSlider + 100


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
  selectedCriteria
  extraColumnCounter = 1
  radioColumnCounter = 1
  commentColumnCounter = 1
  rankingType = 'dropDown'



  constructor() { }
  ngOnInit(): void {
    console.log('');

    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" ) {
        this.columnsNames.push(value)
      }
    });

  }

  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
  setRating(starId, testNameId) {
    this.bmxItem.componentText[testNameId].RATE = starId
  }

  selectStar(starId, testNameId): void {
    this.bmxItem.componentText[testNameId].STARS.filter((star) => {
      if (star.id <= starId) {

        star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';

      } else {

        star.styleClass = 'rating-star';

      }
      return star;
    });
  }

  leaveStar(testNameId): void {
    this.selectedRating = this.bmxItem.componentText[testNameId].RATE
    this.bmxItem.componentText[testNameId].STARS.filter((star) => {
      if (star.id <= this.selectedRating && this.selectedRating !== "") {
        star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';
      } else {
        star.styleClass = 'rating-star';
      }
      return star;
    });
  }

  // CRITERIA STARS

  setCriteriaRating( starId, criteriaId, testNameId) {
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE = starId
  }

  selectCriteriaStar( starId, criteriaId, testNameId): void {
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].STARS.filter((star) => {
      if (star.id <= starId) {

        star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';

      } else {

        star.styleClass = 'rating-star';

      }
      return star;
    });
  }

  leaveCriteriaStar(testNameId, criteriaId): void {
    this.selectedRating = this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].STARS.filter((star) => {
      if (star.id <= this.selectedRating && this.selectedRating !== "") {
        star.styleClass = (this.ratingScaleIcon === 'grade') ? 'active-rating-star' : 'active-rating-bar';
      } else {
        star.styleClass = 'rating-star';
      }
      return star;
    });
  }

  createRatingStars(ratingScale, ratingScaleIcon) {
    let startCounter: any = []
    for (let index = 0; index < ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: ratingScaleIcon,
        styleClass: 'rating-star'
      });
    }
    return startCounter;
  }
  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ END STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️


  upLoadNamesAndRationales(list: string) {
    if (!list) { list = this.listString; }
    if (list) {
      this.listString = list;
      const rows = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split("\t");

      this.extraColumnCounter = 1
      this.columnsNames.forEach((column, index) => {
        if (column == 'name candidates' || column == 'test names' || column == 'names') {
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
    } else {
      this.bmxItem.componentText.forEach((row, index) => {
        row.STARS = this.createRatingStars(this.rankingScaleValue, this.ratingScaleIcon)
        // this.leaveStar(index);
      });
    }
  }

  // COLUMNS ADD AND REMOVE
  insertTextColumn() {
    this.columnsNames.push('ExtraColumn' + (this.extraColumnCounter));
    this.bmxItem.componentText.forEach((object) => {
      let coulmnName  = 'ExtraColumn' + this.extraColumnCounter
      object[coulmnName] = coulmnName + 'txt' 
    });
    this.extraColumnCounter++
  }

  insertCommentBoxColumn() {
    this.columnsNames.push('Comments' + (this.commentColumnCounter));
    this.bmxItem.componentText.forEach((object) => {
      // object = this.addToObject(object, 'Comments' + (this.commentColumnCounter), 'CommentsTxt' + (this.commentColumnCounter), this.commentColumnCounter)
      let coulmnName  = 'Comments' + this.commentColumnCounter
      object[coulmnName] = coulmnName + 'txt' 
    });
    this.commentColumnCounter++
  }

  insertRadioColumn() {
    this.columnsNames.push('RadioColumn' + (this.radioColumnCounter));
    this.bmxItem.componentText.forEach((object, index) => {
      let coulmnName  = 'RadioColumn' + this.radioColumnCounter
      if (index == 0) {
        object[coulmnName] = this.radioColumnCounter 
      } else {
        object[coulmnName] = false 
      }
    });
    this.radioColumnCounter++
  }

  saveRadioColumValue(name, x){
    let values = Object.keys(this.bmxItem.componentText[x])
    values.forEach(columnName => {
      if (columnName.includes('RadioColumn') ) {
        this.bmxItem.componentText[x][columnName] = false
      }
    });
    this.bmxItem.componentText[x][name] = true
  }

 

  deletRow(option): void {
    this.bmxItem.componentText.splice(option, 1);
  }

  insertRow(): void {
      this.bmxItem.componentText.push(this.bmxItem.componentText[0])
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

  criteriaSelection(selectedCriteria) {
    this.ASSIGNED_CRITERIA = selectedCriteria
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


  toogleColumnResizer() {
    this.isColumnResizerOn = !this.isColumnResizerOn
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
