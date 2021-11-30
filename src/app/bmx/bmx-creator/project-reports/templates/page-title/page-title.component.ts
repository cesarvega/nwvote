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
  headerTitle = 'BRANDMATRIXTM COMPLETION STATUS'
  headerContent = `This section details who participated in the BrandMatrixTM \n
                Percentage of participants who have completed the BrandMatrixTM\n
                                        (6 out of 6)`
  
  constructor() { }

  ngOnInit(): void {
  }

}
