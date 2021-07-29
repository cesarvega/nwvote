import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-respondents',
  templateUrl: './respondents.component.html',
  styleUrls: ['./respondents.component.scss']
})
export class RespondentsComponent implements OnInit {
  @Input() isMenuActive14 ;
  displayedColumns = ['firstName', 'lastName', 'email', 'group', 'subGroup', 'weight'/*, 'edit', 'delete'*/];
  dataSource;
  
  RESPONDENTS_LIST = [
    {'firstName':'firstName', 'lastName':'lastName', 'email':'email', 'group':'group', 'subGroup':'subGroup', 'weight':'weight' }
    
  ]
  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
  }

  upLoadResp(list: string): void
  {
     const test = list;
  }


}
