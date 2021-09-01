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

  constructor(private _BmxService: BmxService, private _snackBar: MatSnackBar) {}
  settingsData = { 
    SalesBoardProjectList : [],
    DepartmentList : '',
    OfficeList : '',
    LanguageList : '',
    DirectorList : ''
  };
  stringBmxEditData: any;

  DIRECTORS: Array<any> = [];

  director = {
    Director:'',
  }

  selectedDirector

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
    .subscribe((arg:any) => {
      this.settingsData = JSON.parse(arg.d);
      console.log(JSON.parse(arg.d));
        //AUTOCOMPLETE 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖
      this.settingsData.SalesBoardProjectList.forEach( myObject =>{  this.salesboardObj.push({name: myObject['SalesBoardProjectList']})});
      console.log(this.salesboardObj);
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
  localStorage.setItem( 'fakeproject' + '_project_info', JSON.stringify(this.bmxEditData.value));
  console.log(this.bmxEditData.value);
  } 

  saveProjectInfo() {
    localStorage.setItem( 'fakeproject' + '_project_info', JSON.stringify(this.bmxEditData.value));
    this._snackBar.open('Saved Succesfully');
  }
 


  createDirector(): void {
    // this.directors = [...this.directors, this.directors.length];
    this.DIRECTORS.push(this.director)
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

  fillDirectorInfo(director, index){
    this.director = {
      // Id: director.Id,
      Director:director.Director,
      // Title:director.Title,
      // Email:director.Email,
      // Phone:director.Phone
    }
    this.DIRECTORS[index] = director.Director    
    console.log('test');
    
  }
}