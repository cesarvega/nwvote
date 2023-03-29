import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-first-page',
  templateUrl: './report-first-page.component.html',
  styleUrls: ['./report-first-page.component.scss']
})
export class ReportFirstPageComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @Input() isBrandMatrixSurvey;
  displayInstructions: boolean;
  openSettings = false
  displayLogoWidthRange = false

  reportObject = {
    
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyContact: "",
    companyOffice: "",
    companyDirectors:[{name:'',position:'',office:'',email:''}],
    reportPrepareFor: [{name:'',position:'',office:'',email:'',phone:''}],
    reportProjecName: "",
    reportDescription: "",
    reportDate: new Date(),
    reportLogoMarginLeft: "",
  }


  constructor() { }

  ngOnInit(): void {
  }

}
