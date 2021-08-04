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
  displayedColumns = ['firstName', 'lastName', 'email', 'group', 'subGroup', 'weight', 'delete'];
  dataSource;
  @ViewChild('respondants') myTestDiv: ElementRef;
  
  RESPONDENTS_LIST = [
    {'firstName':'firstName', 'lastName':'lastName', 'email':'email', 'group':'group', 'subGroup':'subGroup', 'weight':'weight' }
    
  ]
  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
  }

  upLoadResp(list: string): void
  {
    const temp = list.split("\n");
    for(var i = 0; i < temp.length; i++)
    {
      if(temp[i] != "")
      {
        this.RESPONDENTS_LIST.push({'firstName': temp[i].split("\t")[0], 'lastName':temp[i].split("\t")[1], 'email':temp[i].split("\t")[2], 'group':temp[i].split("\t")[3], 'subGroup':temp[i].split("\t")[4], 'weight':temp[i].split("\t")[5] });
      }
    }
    this.myTestDiv.nativeElement.value = '';
    this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
    localStorage.setItem('fakeprojectname' + '_repondants list', this.RESPONDENTS_LIST.toString()) 
  }

  deletPart(option: string): void {
    for(var i = 0; i < this.RESPONDENTS_LIST.length; i++)
    {
      if(this.RESPONDENTS_LIST[i].firstName == option)
      {
        this.RESPONDENTS_LIST.splice(i, 1);
        break;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
  }

  public onFocusOutEvent(event: any): void {
    localStorage.setItem('fakeprojectname' + '_repondants list', this.RESPONDENTS_LIST.toString()) 
  }



}
