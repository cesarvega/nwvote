import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  @Input() bmxItem;
  @Input() i;
  @Input() bmxClientPageDesignMode;
  @Input() bmxClientPageOverview;
  @Input() isBrandMatrixSurvey;
  displayInstructions: boolean;
  openSettings = false
  displayLogoWidthRange = false
  constructor() { }

  ngOnInit(): void {
  }

}
