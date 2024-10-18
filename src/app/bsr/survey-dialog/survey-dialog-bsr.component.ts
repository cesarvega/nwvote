import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-survey-dialog-bsr',
  templateUrl: './survey-dialog-bsr.component.html',
  styleUrls: ['./survey-dialog-bsr.component.scss']
})
export class SurveyDialogBsrComponent  {

  @Input() dialogText: string = 'Please share your username and be aware that only ones user should be in the application when editing to avoid overwriting data';
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Input()  userName

  ngOnInit(): void {
    const userName= localStorage.getItem('userName')
    if(userName){
      this.userName = userName
    }
  }

  confirm() {
    this.onConfirm.emit(this.userName);
  }

  cancel() {
    this.onCancel.emit(this.userName);
  }

}
