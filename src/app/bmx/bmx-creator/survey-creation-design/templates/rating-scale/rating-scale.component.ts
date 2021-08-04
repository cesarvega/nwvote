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
  testNamesInput:string
  TestNameDataModel: any[];
  ratingScale = 5;
  TESTNAMES_LIST = [];
 

  constructor() { }
  ngOnInit(): void {
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

  upLoadNamesAndRationales(list: string){
    const textAreaInput = list.split("\n");

    const columnsNames = textAreaInput[0].split("\t");

    textAreaInput.splice(0,1);

    for(var i = 0; i < textAreaInput.length; i++)
    {
      if(textAreaInput[i] != "")
      {
        this.TESTNAMES_LIST.push({'name': textAreaInput[i].split("\t")[0], 'rationale':textAreaInput[i].split("\t")[1]});
      }
    }

    this.TestNameDataModel = [];
    for (let index = 0; index <  this.TESTNAMES_LIST.length; index++) {
      this.TestNameDataModel.push({
        name: this.TESTNAMES_LIST[index].name, rationale: this.TESTNAMES_LIST[index].rationale,
        STARS: this.createRatingStars(this.rankingScaleValue)
      })
    }

     this.bmxItem.componentText =  this.TestNameDataModel;
  }

  deletPart(option: string): void {
    for(var i = 0; i < this.TESTNAMES_LIST.length; i++)
    {
      if(this.TESTNAMES_LIST[i].name == option)
      {
        this.TESTNAMES_LIST.splice(i, 1);
        break;
      }
    }    
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
