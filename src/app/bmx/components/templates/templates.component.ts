import { Component, OnInit, ViewChild } from '@angular/core';
import { BmxService } from '../bmx-creator/bmx.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  brandMatrixObjects = [
  ];
  bmxPages: any = [
    {
      pageNumber: 1,
      page: this.brandMatrixObjects,
    },
  ];
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
  biUserId = 'user@bi.com';
  TEMPLATES = [
    { TemplateName: 'Standard Personal Preference' },
    { TemplateName: 'Ranking' },
    { TemplateName: 'NarrowDown' },
    { TemplateName: 'This or That' },
    { TemplateName: 'Naming Contest' },
    { TemplateName: 'Question & Answer' },
  ];
  displayedColumns = ['displayName', 'TemplateName', 'Created', 'Name', 'Edit', 'Delete'];
  bmxEditData: FormGroup;
  filteredOptions: Observable<string[]>;
  salesboardObj = [];
  showModal = false;
  newTemplateName = ''
  selectedDisplayName = ''
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


          this.dataSource = new MatTableDataSource<any>(this.TEMPLATES);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.currentDirectorList = this.allDirectors;
        for (var i = 0; i < this.DIRECTORS?.length; i++) {
          this.DIRECTORS[i] = this.allDirectors.find(o => o.name === this.DIRECTORS[i].name);
        }

        // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
      });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    //console.log(value);
    return this.settingsData['SalesBoardProjectList'].filter(option => option.toLowerCase().includes(filterValue));/*.slice(0, 10);*/
  }

  templateSelected(templateName: string, displayName: string) {
    this.isSaveOrUpdate = true;
    this.templateName = templateName;
    console.log(this.selectedDisplayName)

    const cadenaSinUnderscores = templateName.replace(/_/g, '');
    this.editBM(cadenaSinUnderscores)
    localStorage.setItem('displayName', displayName);
  }

  editBM(option: string): void {
    this._BmxService.setProjectName(option);
    var test = option;
    localStorage.setItem('projectName', option);

    this.router.navigate(['bmx-creation/99CB72BF-D163-46A6-8A0D-E1531EC7FEDC'])
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


              this.dataSource = new MatTableDataSource<any>(this.TEMPLATES);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
            this.currentDirectorList = this.allDirectors;
            for (var i = 0; i < this.DIRECTORS?.length; i++) {
              this.DIRECTORS[i] = this.allDirectors.find(o => o.name === this.DIRECTORS[i].name);
            }

            // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
          });
      });
    this.showModal = false;
    this.selectedTemplateName = this.newTemplateName
    this.newTemplateName = '';
    console.log(this.selectedDisplayName)
  }
}