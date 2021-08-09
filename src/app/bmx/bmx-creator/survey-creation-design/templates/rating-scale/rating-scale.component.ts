import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-rating-scale',
  templateUrl: './rating-scale.component.html',
  styleUrls: ['./rating-scale.component.scss']
})
export class RatingScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;

  rankingScaleValue = 5;
  selectedIndex: any
  displayInstructions = false;

  selectedStarRatingIndex = ''
  selectedRating = 0;


  // CONFIGURATION VARIABLES
  testNamesInput: string
  TestNameDataModel: any[];
  ratingScale = 5;
  TESTNAMES_LIST = [];
  columnsNames: string[];
  columnsNamesHeader: string[];
  listString: string;


  constructor() { }
  ngOnInit(): void {
    console.log('');
    this.columnsNames = ['name', 'rationale']
  }
  setRating(starId, testNameId) {
    // prevent multiple selection
    if (this.selectedRating === 0) {
      this.bmxItem.componentText[testNameId].STARS.filter((star) => {

        if (star.id <= starId) {

          star.class = 'active-rating-star';

        } else {

          star.class = 'rating-star';

        }

        return star;
      });
    }
  }
  selectStar(starId, testNameId): void {
    // prevent multiple selection
    if (this.selectedRating === 0) {

      this.bmxItem.componentText[testNameId].STARS.filter((star) => {

        if (star.id <= starId) {

          star.class = 'active-rating-star';

        } else {

          star.class = 'rating-star';

        }
        return star;
      });

    }

    // this.selectedRating = value;

  }

  deletPart(option): void {
    this.bmxItem.componentText.splice(option, 1);
  }

  upLoadNamesAndRationales(list: string) {
    if (!list) { list = this.listString;}
    if (list) {
      this.listString  = list;
      const textAreaInput = list.split("\n");
      this.columnsNames = [];
      this.columnsNames = textAreaInput[0].toLowerCase().split("\t");
      // textAreaInput.splice(0,1);
      this.TESTNAMES_LIST = [];
      for (var i = 0; i < textAreaInput.length; i++) {
        if (textAreaInput[i] != "" && textAreaInput[i].length > 6) {
          let objectColumnDefiner = {};

          objectColumnDefiner['STARS'] = this.createRatingStars(this.rankingScaleValue);
          for (var e = 0; e < this.columnsNames.length; e++) {
            if ( (textAreaInput[i].split("\t").length > 0)) {
              objectColumnDefiner[this.columnsNames[e]] = textAreaInput[i].split("\t")[e];
            }
          }
          this.TESTNAMES_LIST.push(objectColumnDefiner);
        }
      }
      this.bmxItem.componentText = this.TESTNAMES_LIST;
    }
  }


  insertNewColumn(){
    this.columnsNames
    let textAreaInput = this.bmxItem.componentText;


    this.columnsNames = [];
    
    this.TESTNAMES_LIST = [];
    for (var i = 0; i < textAreaInput.length; i++) {
      if (textAreaInput[i] != "" && textAreaInput[i].length > 6) {
        let objectColumnDefiner = {};

        objectColumnDefiner['STARS'] = this.createRatingStars(this.rankingScaleValue);
        for (var e = 0; e < this.columnsNames.length; e++) {
          if ( (textAreaInput[i].split("\t").length > 0)) {
            objectColumnDefiner[this.columnsNames[e]] = textAreaInput[i].split("\t")[e];
          }
        }
        this.TESTNAMES_LIST.push(objectColumnDefiner);
      }
    }
    this.bmxItem.componentText = this.TESTNAMES_LIST;
  }


  // PRIVATE METHODS
  createRatingStars(ratingScale) {
    let startCounter: any = []
    for (let index = 0; index < ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: 'grade',
        class: 'rating-star'
      });
    }
    return startCounter;
  }


}
