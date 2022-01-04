import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BmxService } from '../bmx.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { Validators } from '@angular/forms';


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
    DepartmentList: [],
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

  bmxEditData: FormGroup;
  bmxSalesboard: FormControl;
  bmxDepartment: FormControl;
  bmxProjectName: FormControl;
  bmxRegion: FormControl;
  bmxCompany: FormControl;
  bmxLanguage: FormControl;
  bmxRegionalOffice: FormControl;
  bmxRegionalDirector: FormControl;


  ngOnInit(): void {
    this.canEdit = null;
    this.createFormControls();
    this.createForm();
    this.onChanges();
    var items = localStorage.getItem('projectName');
    this._BmxService.setProjectName(items);
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
    this._BmxService.setProjectName(this.bmxEditData.get('bmxProjectName').value.toString());
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
    this._BmxService.saveProjectInfo(this.bmxEditData.get('bmxProjectName').value.toString(), finalString, 'user@bi.com').subscribe(result => {
      var so = result;
    });
    
    // SET DATA STREAM TO AN OBSERVABLE
    this._BmxService.setprojectData(finalString)
    this._snackBar.open('Saved Succesfully');
    localStorage.setItem('department', this.bmxEditData.get('bmxDepartment').value.toString());
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



  createFormControls() {

    this.bmxSalesboard = new FormControl(
      '', [
      Validators.required,
    ]);
    this.bmxDepartment = new FormControl(
      '', [
      Validators.required,
    ]);
    this.bmxProjectName = new FormControl(
      '', [
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9]+$")
    ]);
    this.bmxRegion = new FormControl(
      '', [
      Validators.required,
    ]);
    this.bmxCompany = new FormControl(
      '', [
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9]+$")
    ]);
    this.bmxLanguage = new FormControl(
      '', [
      Validators.required,
    ]);
    this.bmxRegionalOffice = new FormControl(
      '', [
      Validators.required,
    ]);
    this.bmxRegionalDirector = new FormControl();
  }

  createForm() {
    this.bmxEditData = new FormGroup({
      bmxSalesboard: this.bmxSalesboard,
      bmxDepartment: this.bmxDepartment,
      bmxProjectName: this.bmxProjectName,
      bmxRegion: this.bmxRegion,
      bmxCompany: this.bmxCompany,
      bmxLanguage: this.bmxLanguage,
      bmxRegionalOffice: this.bmxRegionalOffice,
      bmxRegionalDirector: this.bmxRegionalDirector,
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