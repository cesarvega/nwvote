import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
// import { Nw3Service } from './nw3.service';
import { ActivatedRoute } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';
import { BmxService } from '../bmx.service';
import { DragulaService } from 'ng2-dragula';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { JsonpClientBackend } from '@angular/common/http';

@Component({
  selector: 'app-project-information',
  templateUrl: './project-information.component.html',
  styleUrls: ['./project-information.component.scss']
})
export class ProjectInformationComponent implements OnInit {
  DIRECTORS_Filtered: any[];

  constructor(private _BmxService: BmxService, private _snackBar: MatSnackBar) { }
  settingsData = {
    SalesBoardProjectList: [],
    DepartmentList: '',
    OfficeList: '',
    LanguageList: '',
    DirectorList: []
  };
  stringBmxEditData: any;

  DIRECTORS: Array<any> = [];


  director = {
    id: '',
    name: '',
    title: '',
    email: '',
    phone: '',
    ngModel: ''
  }

  selectedDirector;

  directorNames = [];


  bmxRegionalDirectorDropdown

  
  bmxEditData = new FormGroup({
    bmxSalesboard: new FormControl(),
    bmxDepartment: new FormControl(),
    bmxProjectName: new FormControl(),
    bmxRegion: new FormControl(),
    bmxCompany: new FormControl(),
    bmxLanguage: new FormControl(),
    bmxRegionalDirector: new FormControl(),
  });

  ngOnInit(): void {

    this._BmxService.getGeneralLists()
      .subscribe((arg: any) => {
        this.settingsData = JSON.parse(arg.d);
        console.log(JSON.parse(arg.d));
        //AUTOCOMPLETE 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖
        this.settingsData.SalesBoardProjectList.forEach(myObject => { this.salesboardObj.push({ name: myObject['SalesBoardProjectList'] }) });
        console.log(this.salesboardObj);
        this.settingsData.DirectorList.forEach(directorObj => {
          this.directorNames.push({
            name: directorObj.Director,
            id: directorObj.Id,
            title: directorObj.Title,
            email: directorObj.Email,
            phone: directorObj.Phone,
            office: directorObj.Office
          })
        });
        this.DIRECTORS_Filtered = this.directorNames
        console.log(this.directorNames);
        this.filteredOptions = this.bmxEditData.controls['bmxSalesboard'].valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
      });
    this.bmxEditData.setValue(JSON.parse(localStorage.getItem('fakeproject' + '_project_info')));

  }
  //AUTOCOMPLETE 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖
  filteredOptions: Observable<string[]>;
  salesboardFilter = new FormControl();
  salesboardObj = [];
  projectName: string;
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(value);
    return this.settingsData['SalesBoardProjectList'].filter(option => option.toLowerCase().includes(filterValue));
  }
  // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE

  directorSelected;
  directorDetails = [];
  public onFocusOutEvent(event: any): void {
    localStorage.setItem('fakeproject' + '_project_info', JSON.stringify(this.bmxEditData.value));
    console.log(this.bmxEditData.value);
  }

  saveProjectInfo() {
    localStorage.setItem('fakeproject' + '_project_info', JSON.stringify(this.bmxEditData.value));
    this._snackBar.open('Saved Succesfully');
  }

  getDirectorNames() {
    // this.settingsData.DirectorList.forEach( myObj =>{  this.directorNames.push({name: myObj['Director']})});
    console.log(this.directorNames);
  }

  createDirector(): void {
    // this.directors = [...this.directors, this.directors.length];
    let director: any = {}
    director.email = ""
    director.id = ""
    director.name = ""
    director.phone = ""
    director.title = ""
    director.ngModel = ""
    this.DIRECTORS.push(director);
  }

  caller(elementId: number): void {
    console.log('New Director Selected Succesfully');
  }

  removeDirector(index) {
    // let index = this.directors.indexOf(index);
    // console.log(index);
    this.DIRECTORS.splice(index, 1);
    // this.directors = [...this.directors.splice(index, 1)];

  }

  fillDirectorInfo(director, index) {

    this.directorNames.forEach(element => {
      if (element.name == director.ngModel) {
        this.director = {
          id: element.id,
          name: element.name,
          title: element.title,
          email: element.email,
          phone: element.phone,
          ngModel: director.ngModel
        }
        this.DIRECTORS[index] = this.director;
      }
    })
  }



  officeSelected(officeName) {

    this.DIRECTORS_Filtered = []
    this.DIRECTORS = []

    this.directorNames.forEach(director => {
      if (director.office == officeName) {
        this.DIRECTORS_Filtered.push(director);
      }
    })
    // console.log(this.DIRECTORS_Filtered);
  }


}