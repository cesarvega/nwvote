import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { Validators } from '@angular/forms';
import { BmxService } from '../bmx-creator/bmx.service';


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
    BrandMatrixTemplateList: [],
    DepartmentList: [],
    OfficeList: [],
    LanguageList: '',
    DirectorList: [],
    DisplayName: '',
    TemplateName: ''
  };
  stringBmxEditData: any;
  isSaveOrUpdate = false;
  templateName = '';

  DIRECTORS: Array<any> = [];

  @Output() saveProjectSuccess = new EventEmitter();

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
  bmxTemplates: FormControl;
  bmxRegionalOffice: FormControl;
  bmxRegionalDirector: FormControl;
  status = "open"
  selectedDate: Date
  TEMPLATES = [
    { TemplateName: 'Standard Personal Preference' },
    { TemplateName: 'Ranking' },
    { TemplateName: 'NarrowDown' },
    { TemplateName: 'This or That' },
    { TemplateName: 'Naming Contest' },
    { TemplateName: 'Question & Answer' },
  ];
  brandMatrixObjects = [
  ];
  bmxPages: any = [
    {
      pageNumber: 1,
      page: this.brandMatrixObjects,
    },
  ];
  displayTemplate = ''
  biUserId = 'user@bi.com';
  templateTitle: string = '';
  showModal = false;
  newTemplateName = ''
  selectedTemplateName = ''
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
          if (arg.d && arg.d.length > 0) {
            var data = JSON.parse(arg.d);
            this.bmxEditData.patchValue({ bmxSalesboard: data.bmxSalesboard });
            this.bmxEditData.patchValue({ bmxProjectName: data.bmxProjectName });
            this.bmxEditData.patchValue({ bmxDepartment: data.bmxDepartment });
            this.bmxEditData.patchValue({ bmxRegion: data.bmxRegion });
            this.bmxEditData.patchValue({ bmxLanguage: data.bmxLanguage });
            this.bmxEditData.patchValue({ bmxCompany: data.bmxCompany });
            this.bmxEditData.patchValue({ bmxStatus: data.bmxStatus });
            if (!data.bmxStatus || data.bmxStatus == "open") {
              this.status = "open"
            } else if (data.bmxStatus == "close") {
              this.status = "close"
            }
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

            this._BmxService.setprojectData(this.bmxEditData.value)
          }
        });
    }

    this._BmxService.getGeneralLists()
      .subscribe((arg: any) => {
        this.settingsData = JSON.parse(arg.d);
        console.log(this.settingsData)
        this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map(obj => { return { templateName: obj.TemplateName, displayName: obj.DisplayName } }) : this.TEMPLATES

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
        for (var i = 0; i < this.DIRECTORS?.length; i++) {
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
  onSelect(event) {
    console.log(event);
    this.selectedDate = event;
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
      "bmxStatus": this.status.toString,
      "bmxClosingDate": this.selectedDate,
    }
    var finalString = JSON.stringify(projectInfo);
    finalString = finalString.replace("[\\u2022,\\u2023,\\u25E6,\\u2043,\\u2219]\\s\\d", '');
    this._BmxService.saveProjectInfo(this.bmxEditData.get('bmxProjectName').value.toString(), finalString, 'user@bi.com').subscribe(result => {
      var so = result;
      this.saveProjectSuccess.emit(true)
    });
    if (this.templateName.length > 3) {
      this.saveOrUpdateTemplate(this.templateName);
    }

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

  replaceMainDirector(index) {
    let temp = this.DIRECTORS[index];
    this.DIRECTORS.splice(index, 1);
    this.DIRECTORS.unshift(temp);
    //this.DIRECTORS[0] = this.DIRECTORS[index]
    //this.DIRECTORS[index] = temp;

    // this.directors = [...this.directors.splice(index, 1)];

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
    ]);
    this.bmxDepartment = new FormControl(
      '', [
    ]);
    this.bmxProjectName = new FormControl(
      '', [
    ]);
    this.bmxRegion = new FormControl(
      '', [
    ]);
    this.bmxCompany = new FormControl(
      '', [
      // Validators.pattern("^[a-zA-Z0-9]+$")
    ]);
    this.bmxLanguage = new FormControl(
      '', [
    ]);
    this.bmxTemplates = new FormControl(
      '', [
    ]);
    this.bmxRegionalOffice = new FormControl(
      '', [
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
      bmxTemplates: this.bmxTemplates,
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

  templateSelected(templateName: string) {
    this.isSaveOrUpdate = true;
    this.templateName = templateName;
    this.loadTemplate(this.templateName);
    this.displayTemplate = templateName
  }

  saveOrUpdateTemplate(templateName, newName?: any) {
    //localStorage.setItem(templateName, JSON.stringify(this.bmxPages));
    localStorage.setItem('template', JSON.stringify(this.bmxPages));
    //this.bmxPages = JSON.parse(localStorage.getItem('template'));
    this._BmxService.saveBrandMatrixTemplate(templateName, this.bmxPages, this.biUserId).subscribe((template: any) => {
      this.templateTitle = "Template '" + templateName + "' saved 🧐";
      this._snackBar.open(this.templateTitle, 'OK', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      })
    })

    if (this.TEMPLATES.indexOf(templateName) < 0) {
      this.TEMPLATES.push(templateName);
    }

    setTimeout(() => {
      //this.openSaveTemplateBox();
    }, 1000);

  }

  loadTemplate(templateName) {
    this._BmxService.getBrandMatrixTemplateByName(templateName).subscribe((template: any) => {
      this.bmxPages = JSON.parse(template.d);
      this._snackBar.open('template ' + "'" + templateName + "'" + ' loaded 😀', 'OK', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      })
    })
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveNewName() {

    this._BmxService.saveBrandMatrixTemplate(this.templateName, this.bmxPages, this.biUserId, this.newTemplateName).subscribe()
    this._BmxService.getGeneralLists()
      .subscribe((arg: any) => {
        this.settingsData = JSON.parse(arg.d);
        this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map(obj => { return { templateName: obj.TemplateName, displayName: obj.DisplayName } }) : this.TEMPLATES

        // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
      });
    this.showModal = false;
    this.selectedTemplateName = this.newTemplateName
    this.newTemplateName = '';
  }

}


