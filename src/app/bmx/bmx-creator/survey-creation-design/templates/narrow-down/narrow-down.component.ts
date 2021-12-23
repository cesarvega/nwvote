import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { RatingScaleComponent } from '../rating-scale/rating-scale.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-narrow-down',
  templateUrl: './narrow-down.component.html',
  styleUrls: ['./narrow-down.component.scss']
})
export class NarrowDownComponent extends RatingScaleComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  SLECTED_ROWS = []
  deleteRows = false
  dragRows = false
  isColumnResizerOn = true;
  editSingleTableCells = false
  constructor(dragulaService: DragulaService, _snackBar: MatSnackBar) {
    super(dragulaService,_snackBar)
  }

  ngOnInit(): void {

    // COLUMN NAMES
    let values = Object.keys(this.bmxItem.componentText[0])

    values.forEach(value => {
      if (typeof value == "string" && value != "STARS" && value != "CRITERIA" && value != "SELECTED_ROW"   ) {
        this.columnsNames.push(value)
      }
    });

    
  }

}
