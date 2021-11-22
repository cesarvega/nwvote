import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';
import { MatTable } from '@angular/material/table';
import { CdkDragStart, CdkDropList, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-respondents',
  templateUrl: './respondents.component.html',
  styleUrls: ['./respondents.component.scss']
})
export class RespondentsComponent implements OnInit {
  @Input() isMenuActive14;
  displayedColumns = ['FirstName', 'LastName', 'Email', 'Type', 'SubGroup', 'AnswerWeight', 'delete'];
  dataSource;
  allData;
  @ViewChild('respondants') myTestDiv: ElementRef;
  testPrct = 'BATTLESTARbm_test'

  dataSource2 = new MatTableDataSource();

  data = [];
  displayedColumns2: string[] = [];
  headers = [];
  dataSeries: any = [];

  previousIndex: number;

  @ViewChild(MatTable) table: MatTable<any>;


  RESPONDENTS_LIST = [
    /*{'firstName':'firstName', 'lastName':'lastName', 'email':'email', 'group':'group', 'subGroup':'subGroup', 'weight':'weight' }*/

  ]
  constructor(private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService) { }

  ngOnInit(): void {
    //grab project name from local

    /*
    this.headers = [
      { field: 'A', index: 0 },
      { field: 'B', index: 1 },
      { field: 'C', index: 2 }
    ];

    this.data = [
      { A: 22, B: 55, C: 98 },
      { A: 14, B: 90, C: 134 },
      { A: 567, B: 1234, C: 567 }
    ];

    this.setDisplayedColumns();

    this.dataSource2 = new MatTableDataSource(this.data);
    console.log(this.dataSource.data);
    */


    this._BmxService.BrandMatrixGetParticipantList(localStorage.getItem('projectName'))
      .subscribe((arg: any) => {
        this.RESPONDENTS_LIST = JSON.parse(arg.d).ParticipantList;
        this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
        localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST));
      });
  }

  upLoadResp(list: string): void {
    const temp = list.split("\n");
    for (var i = 0; i < temp.length; i++) {
      if (temp[i] != "" && temp[i].includes('\t')) {
        this.RESPONDENTS_LIST.push({ 'ProjectName': localStorage.getItem('projectName'), 'UserId': (this.RESPONDENTS_LIST.length + 1), 'Password': '', 'FirstName': temp[i].split("\t")[0], 'LastName': temp[i].split("\t")[1], 'Email': temp[i].split("\t")[2], 'Type': temp[i].split("\t")[3], 'Status': '', 'SubGroup': temp[i].split("\t")[4], 'AnswerWeight': temp[i].split("\t")[5] });
      }
      else if (temp[i] != "") {
        this.RESPONDENTS_LIST.push({ 'ProjectName': localStorage.getItem('projectName'), 'UserId': (this.RESPONDENTS_LIST.length + 1), 'Password': '', 'FirstName': temp[i].split(" ")[0], 'LastName': temp[i].split(" ")[1], 'Email': temp[i].split(" ")[2], 'Type': temp[i].split(" ")[3], 'Status': '', 'SubGroup': temp[i].split(" ")[4], 'AnswerWeight': temp[i].split(" ")[5] });
      }
    }
    this.myTestDiv.nativeElement.value = '';
    this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);


    var finalString = JSON.stringify(this.RESPONDENTS_LIST);
    finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
    this._BmxService.BrandMatrixSaveParticipantList(localStorage.getItem('projectName'), this.RESPONDENTS_LIST).subscribe(result => {
      var so = result;
    });
    localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST))
  }

  deletPart(option: string): void {
    if (confirm("Are you sure to delete " + option)) {
      for (var i = 0; i < this.RESPONDENTS_LIST.length; i++) {
        if (this.RESPONDENTS_LIST[i].FirstName == option) {
          var deletedObj = [];
          deletedObj.push(this.RESPONDENTS_LIST[i]);
          this.RESPONDENTS_LIST.splice(i, 1);
          break;
        }
      }
      this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
      var finalString = JSON.stringify(this.RESPONDENTS_LIST);
      finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
      this._BmxService.BrandMatrixDelParticipantList(localStorage.getItem('projectName'), deletedObj).subscribe(result => {
        var so = result;
      });
      localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST));
    }
  }

  public onFocusOutEvent(event: any): void {
    localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST))
  }

  setDisplayedColumns() {
    this.headers.forEach((col, index) => {
      col.index = index;
      this.displayedColumns2[index] = col.field;
    });
  }

  dragStarted(event: CdkDragStart, index: number) {
    this.previousIndex = index;
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    if (event) {
      moveItemInArray(this.headers, event.previousIndex, event.currentIndex);
      this.headers = [...this.headers];
      this.setDisplayedColumns();
      console.log(this.dataSource.data);
    }
  }

}
