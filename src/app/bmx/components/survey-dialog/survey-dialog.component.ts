import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-survey-dialog',
  templateUrl: './survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.scss']
})
export class SurveyDialogComponent  {

  @Input() dialogText: string;
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }

}
