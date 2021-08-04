import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-project-information',
  templateUrl: './project-information.component.html',
  styleUrls: ['./project-information.component.scss']
})
export class ProjectInformationComponent implements OnInit {

  constructor(private _BmxService: BmxService) { }
  settingsData = { 
    SalesBoardProjectList : [],
    DepartmentList : '',
    OfficeList : '',
    LanguageList : '',
    DirectorList : ''
  };
  stringBmxEditData: any;
  bmxEditData = new FormGroup({
    bmxSalesboard: new FormControl(),
    bmxDepartment: new FormControl(),
    bmxProjectName: new FormControl(),
    bmxRegion: new FormControl(),
    bmxCompany: new FormControl(),
    bmxLanguage: new FormControl(),
    bmxRegionalDirector: new FormControl(),
    bmxDirectorName: new FormControl()
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

  }
  //AUTOCOMPLETE 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖
  filteredOptions: Observable<string[]>;
  salesboardFilter = new FormControl();
  salesboardObj = [];

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(value);
    return this.settingsData['SalesBoardProjectList'].filter(option => option.toLowerCase().includes(filterValue));
  }
  // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
}
