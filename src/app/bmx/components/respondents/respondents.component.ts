import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
// import { DragulaService } from 'ng2-dragula';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CdkDragStart, CdkDropList, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BmxService } from '../bmx-creator/bmx.service';

@Component({
  selector: 'app-respondents',
  templateUrl: './respondents.component.html',
  styleUrls: ['./respondents.component.scss']
})
export class RespondentsComponent implements OnInit {
  @Input() isMenuActive14;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['FirstName', 'LastName', 'Email', 'Type', 'SubGroup', 'AnswerWeight', 'delete'];
  dataSource;
  allData;
  @ViewChild('respondants') myTestDiv: ElementRef;
  testPrct = 'BATTLESTARbm_test'
  projectId;
  DIRECTORS;

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
  constructor(private _BmxService: BmxService) { }

  ngOnInit(): void {

    this._BmxService.currentProjectName$.subscribe((projectName) => {
      this.projectId = projectName !== '' ? projectName : this.projectId;
    });

    this._BmxService.BrandMatrixGetParticipantList(this.projectId)
      .subscribe((arg: any) => {
        this.RESPONDENTS_LIST = JSON.parse(arg.d).ParticipantList;

        localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST));
      });

    this._BmxService.getProjectInfo(this.projectId)
      .subscribe((arg: any) => {
        if (arg.d && arg.d.length > 0) {
          var data = JSON.parse(arg.d);
          this.DIRECTORS = data.bmxRegionalOffice;
          this.DIRECTORS.forEach(director => {
            if (this.RESPONDENTS_LIST.map(e => e.Email).indexOf(director.email.trim()) == -1) {
              this.RESPONDENTS_LIST.push({ 'ProjectName': this.projectId, 'UserId': (this.RESPONDENTS_LIST.length + 1), 'Password': '', 'FirstName': director.name.split(" ")[0], 'LastName': director.name.split(" ")[1], 'Email': director.email.trim(), 'Type': "A", 'Status': '', 'SubGroup': '1', 'AnswerWeight': '1' });
              var finalString = JSON.stringify(this.RESPONDENTS_LIST);
              finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
              this._BmxService.BrandMatrixSaveParticipantList(this.projectId, this.RESPONDENTS_LIST).subscribe(result => {
                var so = result;
              });
            }

          })
        }
        this.RESPONDENTS_LIST.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
        this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);

      });
    this._BmxService.BrandMatrixSaveParticipantList(this.projectId, this.RESPONDENTS_LIST).subscribe(result => {
      var so = result;
    });


  }


  upLoadResp(list: string): void {
    console.log(list.split("\n").length)
    if (list!='') {
      const temp = list.split("\n");
      for (var i = 0; i < temp.length; i++) {
        if (this.RESPONDENTS_LIST.map(e => e.Email).indexOf(temp[i].split("\t")[2]) == -1 && this.RESPONDENTS_LIST.map(e => e.Email).indexOf(temp[i].split(" ")[2]) == -1) {
          if (temp[i] != "" && temp[i].includes('\t') && temp[i].split("\t").length > 3) {
            this.RESPONDENTS_LIST.push({ 'ProjectName': this.projectId, 'UserId': (this.RESPONDENTS_LIST.length + 1), 'Password': '', 'FirstName': temp[i].split("\t")[0], 'LastName': temp[i].split("\t")[1], 'Email': temp[i].split("\t")[2], 'Type': temp[i].split("\t")[3], 'Status': '', 'SubGroup': temp[i].split("\t")[4], 'AnswerWeight': temp[i].split("\t")[5] });
          }
          else if (temp[i] != "" && temp[i].includes('\t') && temp[i].split("\t").length == 3) {
            this.RESPONDENTS_LIST.push({ 'ProjectName': this.projectId, 'UserId': (this.RESPONDENTS_LIST.length + 1), 'Password': '', 'FirstName': temp[i].split("\t")[0], 'LastName': temp[i].split("\t")[1], 'Email': temp[i].split("\t")[2], 'Type': 'A', 'Status': '', 'SubGroup': '1', 'AnswerWeight': '1' });
          }
          else if (temp[i] != "" && temp[i].split(" ").length > 3) {
            this.RESPONDENTS_LIST.push({ 'ProjectName': this.projectId, 'UserId': (this.RESPONDENTS_LIST.length + 1), 'Password': '', 'FirstName': temp[i].split(" ")[0], 'LastName': temp[i].split(" ")[1], 'Email': temp[i].split(" ")[2], 'Type': temp[i].split(" ")[3], 'Status': '', 'SubGroup': '', 'AnswerWeight': temp[i].split(" ")[5] });
          }
          else if (temp[i] != "" && temp[i].split(" ").length == 3) {
            this.RESPONDENTS_LIST.push({ 'ProjectName': this.projectId, 'UserId': (this.RESPONDENTS_LIST.length + 1), 'Password': '', 'FirstName': temp[i].split(" ")[0], 'LastName': temp[i].split(" ")[1], 'Email': temp[i].split(" ")[2], 'Type': 'A', 'Status': '', 'SubGroup': '1', 'AnswerWeight': '1' });

          }
        }
      }
      this.myTestDiv.nativeElement.value = '';
      this.RESPONDENTS_LIST.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
      this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);


      var finalString = JSON.stringify(this.RESPONDENTS_LIST);
      finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
      this._BmxService.BrandMatrixSaveParticipantList(this.projectId, this.RESPONDENTS_LIST).subscribe(result => {
        var so = result;
      });
      localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST))
    }
  }

  deletPart(option: string): void {
    if (confirm("Are you sure to delete " + option)) {
      if (option == 'all') {
        var deletedObj = this.RESPONDENTS_LIST;
        this.RESPONDENTS_LIST = [];
      }
      else {
        for (var i = 0; i < this.RESPONDENTS_LIST.length; i++) {
          if (this.RESPONDENTS_LIST[i].FirstName == option) {
            var deletedObj = [];
            deletedObj.push(this.RESPONDENTS_LIST[i]);
            this.RESPONDENTS_LIST.splice(i, 1);
            break;
          }
        }
      }

      this.dataSource = new MatTableDataSource<any>(this.RESPONDENTS_LIST);
      var finalString = JSON.stringify(this.RESPONDENTS_LIST);
      finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
      this._BmxService.BrandMatrixDelParticipantList(this.projectId, deletedObj).subscribe(result => {
        var so = result;
      });
      localStorage.setItem('fakeprojectname' + '_repondants list', JSON.stringify(this.RESPONDENTS_LIST));
    }
  }

  public onFocusOutEvent(event: any): void {
    var finalString = JSON.stringify(this.RESPONDENTS_LIST);
    finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
    this._BmxService.BrandMatrixUptParticipantList(this.projectId, this.RESPONDENTS_LIST).subscribe(result => {
      var so = result;
    });
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
