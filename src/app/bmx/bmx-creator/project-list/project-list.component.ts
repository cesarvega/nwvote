import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';
import { DragulaService } from 'ng2-dragula';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { BmxService } from '../bmx.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource;
  allData;
  viewedData;
  displayedColumns = ['Client', 'ProjectName', 'Department', 'Office', 'Created', 'Close', 'Email', 'Edit', 'Delete'];
  selected;

  title = 'ng-calendar-demo';
  selectedDate = new Date('2019/09/26');
  startAt = new Date('2019/09/11');
  minDate = new Date('2019/09/14');
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  year: any;
  DayAndDate: string;
  projectName: any;
  projectId: any;
  @Input() isMenuActive1 ;
  constructor(@Inject(DOCUMENT) private document: any,private activatedRoute: ActivatedRoute,
  private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService) { }

  ngOnInit(): void {
    this.selected = 'Live'
    this.isMenuActive1 = true;
    this._BmxService.getGetProjectList()
    .subscribe((arg:any) => {
      let obj = '[{"ProjectName":"test33333","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test2","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":"123456"},{"ProjectName":"test3","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test4","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test5","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test6","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":"56456"},{"ProjectName":"test7","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test1","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test2","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":"123456"},{"ProjectName":"test3","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test4","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test5","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null},{"ProjectName":"test6","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":"56456"},{"ProjectName":"test777777","ProjectId":616,"Status":"C","Department":"","Office":"","Created":null,"Close":null}]';
      this.allData = JSON.parse(arg.d);
      // this.allData = JSON.parse(obj);
      this.changeView();     
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendEmail(option: string): void {
    var test = option;
  }

  editBM(option: string): void {
    var test = option;
  }

  deleteBM(option: string): void {
    var test = option;
  }

  changeView(): void
  {
    this.viewedData = [];
      for(let i = 0; i < this.allData.length; i++)
      {
        if(this.selected == 'Live' && this.allData[i].Status == 'O')
        {
          this.viewedData.push(this.allData[i])
        }
        else if(this.selected == 'Closed' && this.allData[i].Close != 'O')
        {
          this.viewedData.push(this.allData[i])
        }
        else if(this.selected == 'All')
        {
          this.viewedData = this.allData;
          break;
        }
      }
      this.dataSource = new MatTableDataSource<any>(this.viewedData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

  onSelect(event) {
    this.selectedDate = event;
    const dateString = event.toDateString();
    const dateValue = dateString.split(' ');
    this.year = dateValue[3];
    this.DayAndDate = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
  }

  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 ;
  }

}
