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
  columnsSlider = 358 
  rowHeightSlider = 1.5
  fontSizeRow = 19 


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

  constructor() { }
  ngOnInit(): void {
    console.log('');
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS") {
        this.columnsNames.push(value)
      }
    });

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
        icon: ratingScaleIcon,
        class: 'rating-star'
      });
    }
    return startCounter;
  }
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
        // this.leaveStar(index);
      });
    }
  }

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
    this.bmxItem.componentText = JSON.parse(JSON.stringify(this.bmxItem.componentText));
  }


  checkDragEvetn(e) {
    console.log(e);
  }


  addToObject(obj, key, value, index) {
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


  setFontSize(size) {

    this.bmxItem.componentSettings[0].fontSize = size

  }

  setColumnWidth(columnWidth) {
    this.bmxItem.componentSettings[0].columnWidth = columnWidth

  }
  setSMALLTextLengthColumnHeight(columnHeight) {
    this.bmxItem.componentSettings[0].columnHeight = columnHeight

  }
  setBIGTextLengthColumnHeight(size) {
    console.log(size);

  }

  toogleColumnResizer() {
    this.isColumnResizerOn = !this.isColumnResizerOn
  }

}
