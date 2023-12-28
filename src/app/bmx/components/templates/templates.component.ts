import { Component, OnInit } from '@angular/core';
import { BmxService } from '../bmx-creator/bmx.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  constructor(private _BmxService: BmxService, private router: Router,) { }
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
  selectedTemplateName = ''


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
  TEMPLATES = [
    { TemplateName: 'Standard Personal Preference' },
    { TemplateName: 'Ranking' },
    { TemplateName: 'NarrowDown' },
    { TemplateName: 'This or That' },
    { TemplateName: 'Naming Contest' },
    { TemplateName: 'Question & Answer' },
  ];
  bmxEditData: FormGroup;
  filteredOptions: Observable<string[]>;
  salesboardObj = [];
  ngOnInit(): void {
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
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    //console.log(value);
    return this.settingsData['SalesBoardProjectList'].filter(option => option.toLowerCase().includes(filterValue));/*.slice(0, 10);*/
  }

  templateSelected(templateName: string) {
    this.isSaveOrUpdate = true;
    this.templateName = templateName;
    console.log(templateName)
    const cadenaSinUnderscores = templateName.replace(/_/g, '');
    this.editBM(cadenaSinUnderscores)
  }
  
    editBM(option: string): void {
    this._BmxService.setProjectName(option);
    var test = option;
    localStorage.setItem('projectName', option);
    this.router.navigate(['bmx-creation/99CB72BF-D163-46A6-8A0D-E1531EC7FEDC'])
  }
}
