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
import { filter, map, startWith } from 'rxjs/operators';
import { JsonpClientBackend } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';


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
    OfficeList: [],
    LanguageList: '',
    DirectorList: []
  };
  stringBmxEditData: any;

  DIRECTORS: Array<any> = [];



  selectedDirector;
  officeLocations: Array<any> = [];
  allDirectors: Array<any> = [];
  currentDirectorList: Array<any> = [];
  bmxRegionalDirectorDropdown;
  bmxDirecttorSelect;
  office = '';
  empty = '';
  dName;
  canEdit;
  isDisplay = true;

  bmxEditData = new FormGroup({
    bmxSalesboard: new FormControl(),
    bmxDepartment: new FormControl(),
    bmxProjectName: new FormControl(),
    bmxRegion: new FormControl(),
    bmxCompany: new FormControl(),
    bmxLanguage: new FormControl(),
    bmxRegionalOffice: new FormControl(),
    bmxRegionalDirector: new FormControl(),
  });

  ngOnInit(): void {
    this.canEdit = null;
    this.initForm();
    this.onChanges();
    var items = localStorage.getItem('projectName');
    if (items != undefined || items != null) {
      this._BmxService.getProjectInfo(localStorage.getItem('projectName'))
        .subscribe((arg: any) => {
          var data = JSON.parse(arg.d);
          this.bmxEditData.patchValue({ bmxSalesboard: data.bmxSalesboard });
          this.bmxEditData.patchValue({ bmxProjectName: data.bmxProjectName });
          this.bmxEditData.patchValue({ bmxDepartment: data.bmxDepartment });
          this.bmxEditData.patchValue({ bmxRegion: data.bmxRegion });
          this.bmxEditData.patchValue({ bmxLanguage: data.bmxLanguage });
          this.bmxEditData.patchValue({ bmxCompany: data.bmxCompany });
          var list;
          /*
          for (let i = 0; i < data.DirectorList.length; i++) {
            let director: any = {}
            director.email = data.DirectorList[i].Email;
            director.id = ""
            director.name = data.DirectorList[i].Director
            director.phone = data.DirectorList[i].Phone
            director.title = data.DirectorList[i].Title
            director.ngModel = director.ngModel
            director.office = ''
            this.DIRECTORS.push(director);
          }*/
          this.DIRECTORS = data.bmxRegionalOffice;
          this.bmxEditData.patchValue({ bmxRegionalOffice: this.DIRECTORS });

        });
    }

    this._BmxService.getGeneralLists()
      .subscribe((arg: any) => {
        this.settingsData = JSON.parse(arg.d);
        this.settingsData.OfficeList.unshift('All');
        //console.log(JSON.parse(arg.d));
        //AUTOCOMPLETE 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖
        this.settingsData.SalesBoardProjectList.forEach(myObject => { this.salesboardObj.push({ name: myObject['SalesBoardProjectList'] }) });
        this.settingsData.DirectorList.forEach(directorObj => {
          this.allDirectors.push({
            name: directorObj.Director,
            id: directorObj.Id,
            title: directorObj.Title,
            email: directorObj.Email,
            phone: directorObj.Phone,
            office: directorObj.Office,
          })


        });
        this.currentDirectorList = this.allDirectors;
        for (var i = 0; i < this.DIRECTORS.length; i++) {
          this.DIRECTORS[i] = this.allDirectors.find(o => o.name === this.DIRECTORS[i].name);
        }
        this.filteredOptions = this.bmxEditData.controls['bmxSalesboard'].valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
      });
    //this.bmxEditData.setValue(JSON.parse(localStorage.getItem('fakeproject' + '_project_info')));


  }
  //AUTOCOMPLETE 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖
  filteredOptions: Observable<string[]>;
  salesboardFilter = new FormControl();
  salesboardObj = [];
  projectName: string;
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    //console.log(value);
    return this.settingsData['SalesBoardProjectList'].filter(option => option.toLowerCase().includes(filterValue));/*.slice(0, 10);*/
  }
  // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE

  directorSelected;
  directorDetails = [];
  public onFocusOutEvent(event: any): void {
    localStorage.setItem('fakeproject' + '_project_info', JSON.stringify(this.bmxEditData.value));
    //console.log(this.bmxEditData.value);
  }

  saveProjectInfo() {
    //localStorage.setItem('fakeproject' + '_project_info', JSON.stringify(this.bmxEditData.value));
    /*const rememberUser:JSON = <JSON><unknown>{
      "Client": this.bmxEditData.get('bmxCompany').value
    }*/
    const projectInfo: JSON = <JSON><unknown>{
      "bmxSalesboard": this.bmxEditData.get('bmxSalesboard').value.toString(),
      "bmxDepartment": this.bmxEditData.get('bmxDepartment').value.toString(),
      "bmxProjectName": this.bmxEditData.get('bmxProjectName').value.toString(),
      "bmxRegion": this.bmxEditData.get('bmxRegion').value.toString(),
      "bmxCompany": this.bmxEditData.get('bmxCompany').value.toString(),
      "bmxLanguage": this.bmxEditData.get('bmxLanguage').value.toString(),
      "bmxRegionalOffice": this.DIRECTORS,
    }
    var finalString = JSON.stringify(projectInfo);
    finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
    this._BmxService.saveProjectInfo(localStorage.getItem('projectName'), finalString, 'user@bi.com').subscribe(result => {
      var so = result;
    });
    this._snackBar.open('Saved Succesfully');
  }



  createDirector(): void {
    if (this.dName != undefined) {
      let director: any = {}
      director.email = ""
      director.id = ""
      director.name = ""
      director.phone = ""
      director.title = ""
      director.ngModel = ""
      director.office = ''
      director.type = 'BI'
      director = this.allDirectors.find(o => o.name === this.dName)
      this.DIRECTORS.push(director);

    }

  }

  createCustomDirector(): void {
    // this.directors = [...this.directors, this.directors.length];
    let director: any = {}
    director.email = ""
    director.id = ""
    director.name = ""
    director.phone = ""
    director.title = ""
    director.ngModel = ""
    director.office = ''
    director.type = 'Custom'
    this.DIRECTORS.push(director);
  }

  caller(elementId: number): void {
    //console.log('New Director Selected Succesfully');
  }

  removeDirector(index) {
    // let index = this.directors.indexOf(index);
    // console.log(index);
    this.DIRECTORS.splice(index, 1);
    // this.directors = [...this.directors.splice(index, 1)];

  }

  editDirector(index) {
    if (this.canEdit === index) {
      this.canEdit = null;
    }
    else {
      this.canEdit = index;

    }
  }


  officeSelected(officeName) {
    if (officeName != '' && officeName != 'All') {
      this.office = officeName;
      this.currentDirectorList = [];

      this.allDirectors.forEach(director => {
        if (director.office == officeName) {
          this.currentDirectorList.push(director);
        }
      })

    }
  }



  initForm() {
    this.bmxEditData = new FormGroup({
      bmxSalesboard: new FormControl(),
      bmxDepartment: new FormControl(),
      bmxProjectName: new FormControl(),
      bmxRegion: new FormControl(),
      bmxCompany: new FormControl(),
      bmxLanguage: new FormControl(),
      bmxRegionalOffice: new FormControl(),
      bmxRegionalDirector: new FormControl(),
    });
  }

  selected(matSelectChange: MatSelectChange, index: number) {
    this.DIRECTORS[index] = this.allDirectors.find(o => o.name === matSelectChange.value);
  }

  trackByIndex(index, item) {
    return index;
  }

  onChanges(): void {

    this.bmxEditData.get('bmxRegion').valueChanges.subscribe(val => {
      if (val !== null || val != '') {
        this.DIRECTORS = [];
        this.allDirectors.forEach(director => {
          if (director.office == val) {
            this.DIRECTORS.push(director);
          }
        })

      }
    });
    this.bmxEditData.get('bmxSalesboard').valueChanges.subscribe(val => {
      this.bmxEditData.patchValue({ bmxProjectName: val });
    });
  }
}