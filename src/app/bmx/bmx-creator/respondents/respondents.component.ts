import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-respondents',
  templateUrl: './respondents.component.html',
  styleUrls: ['./respondents.component.scss']
})
export class RespondentsComponent implements OnInit {
  @Input() isMenuActive14 ;
  RESPONDENTS_LIST = [
    {'firstName':'firstName', 'lastName':'lastName', 'email':'email'},
    {'firstName':'Cesar', 'lastName':'Vega', 'email':'myemail@email.com'},
    {'firstName':'Carlos', 'lastName':'Gomez', 'email':'myemail@email.com'},
    {'firstName':'Kenneth', 'lastName':'Cabrera', 'email':'myemail@email.com'},
    {'firstName':'Pedro', 'lastName':'Reyes', 'email':'myemail@email.com'},
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
