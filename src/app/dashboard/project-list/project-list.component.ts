import { Component,EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { BmxService } from '../../service/bmx.service'

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  @Input() isMenuActive1: any;
  @Output() isMenuActive1Close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isMenuActive1Email: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any
  allData: any[] = [];
  viewedData: any[] = [];
  displayedColumns = ['bmxCompany', 'bmxProjectName', 'bmxDepartment', 'bmxRegion', 'Created', 'Close', 'Active', 'Email', 'Edit', 'Delete'];
  selected!: string;

  title = 'ng-calendar-demo';
  selectedDate: any;
  startAt = new Date('2019/09/11');
  minDate = new Date('2019/09/14');
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  year: any;
  DayAndDate!: string;
  projectName: any;
  projectId: any;



  @Input() userOffice: any
  @Input() userDepartment: any
  @Input()
  userRole!: string;

  constructor( private _BmxService: BmxService) { }

  ngOnInit(): void {
    this.selected = 'Live'
    this._BmxService.getGetProjectList()
      .subscribe((arg: any) => {
        this.allData = JSON.parse(arg.d);
        // this.allData = JSON.parse(obj);
        this.changeView();
      });
  }


  applyFilter(filterValue: any): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendEmail(option: string): void {
    var test = option;
    this._BmxService.setProjectName(option);
    localStorage.setItem('projectName', option);
    this.isMenuActive1Email.emit(false);
  }

  editBM(option: string): void {
    this._BmxService.setProjectName(option);
    var test = option;
    localStorage.setItem('projectName', option);
    this.isMenuActive1Close.emit(false);
  }

  setBMStatus(option: { bmxStatus: string | undefined; bmxProjectName: any; }): void {
    if (confirm('Are you sure you want to change this project status?')) {
      let status
      if (!option.bmxStatus || option.bmxStatus == "open") {
        status = "close"
      } else if (option.bmxStatus == "close") {
        status = "open"
      }
      let projectInfo = {
        ...option,
        "bmxStatus": status
      }
      let payload = JSON.stringify(projectInfo)
      this._BmxService.saveProjectInfo(option.bmxProjectName, payload, 'user@bi.com').subscribe((result: any) => {
        var so = result;
      });
      this._BmxService.setprojectData(payload)
      option.bmxStatus = status
    }
    this._BmxService.getGetProjectList()
    .subscribe((arg: any) => {
      this.allData = JSON.parse(arg.d);
      this.changeView();
    });
  }
  deleteBM(option: string): void {
    var test = option;
  }

  changeView(): void {

    this.viewedData = [];
    for (let i = 0; i < this.allData.length; i++) {
      if (this.selected == 'Live' && JSON.parse(this.allData[i].ProjectInfo).bmxStatus == 'open') {
        this.viewedData.push(JSON.parse(this.allData[i].ProjectInfo));
      }
      else if (this.selected == 'Closed' && JSON.parse(this.allData[i].ProjectInfo).bmxStatus == "close") {
        this.viewedData.push(JSON.parse(this.allData[i].ProjectInfo))
      }
      else if (this.selected == 'All') {
        if (this.allData[i].ProjectInfo != "" && this.allData[i].ProjectInfo != null) {
          var t = JSON.parse(this.allData[i].ProjectInfo);
          this.viewedData.push(JSON.parse(this.allData[i].ProjectInfo));

        }
      }
    }

    if (this.selectedDate) {
      this.viewedData = this.viewedData.filter((project: { bmxClosingDate: any; })=>project.bmxClosingDate == this.selectedDate.toISOString())
    }

    // FILTERING BY DEPARTMENT & OFFICE
    if (this.viewedData.length > 0) {
      if (this.userRole == 'Director') {
        this.viewedData = this.viewedData.filter((filterByOffice: any) => filterByOffice.bmxRegion == this.userOffice);
      } if (this.userRole == 'Administrator' || this.userRole == 'Adminstrator') {
        // this.viewedData = this.viewedData.filter((filterByDepartment: any) => filterByDepartment.bmxDepartment == this.userDepartment);
      } else if (this.userRole == 'Creative' || this.userRole == 'Nonprop' || this.userRole == 'Design') {
        this.viewedData = this.viewedData.filter((filterByDepartment: any) => filterByDepartment.bmxDepartment == this.userDepartment);
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.viewedData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSelect(event: any) {
    this.selectedDate = event;
    const dateString = event.toDateString();
    const dateValue = dateString.split(' ');
    this.year = dateValue[3];
    this.DayAndDate = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
    this.changeView()
  }

  onDeselect(){
    this.selectedDate = null
    this.changeView()
  }

  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }



}
