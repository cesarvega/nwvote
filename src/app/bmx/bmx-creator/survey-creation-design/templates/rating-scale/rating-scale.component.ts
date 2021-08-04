import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-rating-scale',
  templateUrl: './rating-scale.component.html',
  styleUrls: ['./rating-scale.component.scss']
})
export class RatingScaleComponent implements OnInit {

  @Input() bmxItem;
  @Input() i;
  @Input() isMenuActive11;
 
  
  rankingScaleValue = 5;
  selectedIndex: any
  displayInstructions = false;

  selectedStarRatingIndex = ''
  selectedRating = 0;

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


}
