import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';


@Component({
  selector: 'app-respondents',
  templateUrl: './respondents.component.html',
  styleUrls: ['./respondents.component.scss']
})
export class RespondentsComponent implements OnInit {
  @Input() isMenuActive14 ;
  displayedColumns = ['FirstName', 'LastName', 'Email', 'group', 'SubGroup', 'AnswerWeight', 'delete'];
  dataSource;
  allData;
  @ViewChild('respondants') myTestDiv: ElementRef;
  testPrct = 'BATTLESTARbm_test'
  
  RESPONDENTS_LIST = [
    /*{'firstName':'firstName', 'lastName':'lastName', 'email':'email', 'group':'group', 'subGroup':'subGroup', 'weight':'weight' }*/
    
  ]
  constructor(private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService) { }

  ngOnInit(): void {
    //grab project name from local
    this._BmxService.BrandMatrixGetParticipantList(localStorage.getItem('projectName'))
    .subscribe((arg:any) => {
      this.RESPONDENTS_LIST = JSON.parse(arg.d).ParticipantList;
       this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
       localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST));
    });




    //localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST));
    //var test = localStorage.getItem('fakeprojectname' + '_repondants list');
    // this.RESPONDENTS_LIST = JSON.parse(test);
    //this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
  }

  upLoadResp(list: string): void
  {
    const temp = list.split("\n");
    for(var i = 0; i < temp.length; i++)
    {
      let z = Math.floor(Math.random() * 3);;
      let y = '';
      if(z == 0)
      {
        y = 'NS'
      }
      else if(z == 1)
      {
        y = 'NF'
      }
      else
      {
        y = 'F'
      }
        
      if(temp[i] != "" && temp[i].includes('\t'))
      {
        this.RESPONDENTS_LIST.push({'FirstName': temp[i].split("\t")[0], 'LastName':temp[i].split("\t")[1], 'Email':temp[i].split("\t")[2], 'group':temp[i].split("\t")[3], 'SubGroup':temp[i].split("\t")[4], 'AnswerWeight':temp[i].split("\t")[5], 'Status':y });
      }
      else if(temp[i] != "")
      {
        this.RESPONDENTS_LIST.push({'FirstName': temp[i].split(" ")[0], 'LastName':temp[i].split(" ")[1], 'Email':temp[i].split(" ")[2], 'group':temp[i].split(" ")[3], 'SubGroup':temp[i].split(" ")[4], 'AnswerWeight':temp[i].split(" ")[5], 'Status':y });
      }
    }
    this.myTestDiv.nativeElement.value = '';
    this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
    localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST)) 
  }

  deletPart(option: string): void {
    if(confirm("Are you sure to delete "+ option)) 
    {
      for(var i = 0; i < this.RESPONDENTS_LIST.length; i++)
    {
      if(this.RESPONDENTS_LIST[i].FirstName == option)
      {
        this.RESPONDENTS_LIST.splice(i, 1);
        break;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
    localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST));
    }
  }

  public onFocusOutEvent(event: any): void {
    localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST)) 
  }

}
