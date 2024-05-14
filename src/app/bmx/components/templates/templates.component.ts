import { Component, OnInit, ViewChild } from '@angular/core';
import { BmxService } from '../bmx-creator/bmx.service';
import { Observable } from 'rxjs';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  constructor(private _BmxService: BmxService, private router: Router, public _snackBar: MatSnackBar) { }
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
    { TemplateName: 'Standard Personal Preference', displayName: '' },
    { TemplateName: 'Ranking', displayName: '' },
    { TemplateName: 'NarrowDown', displayName: '' },
    { TemplateName: 'This or That', displayName: '' },
    { TemplateName: 'Naming Contest', displayName: '' },
    { TemplateName: 'Question & Answer', displayName: '' },
  ];
  displayedColumns = ['index','displayName', 'created', 'Edit' , 'Name', 'Delete'];
  bmxEditData: UntypedFormGroup;
  filteredOptions: Observable<string[]>;
  salesboardObj = [];
  showModal = false;
  newTemplateName = ''
  selectedDisplayName = ''
  showNewTemplateModal = false
  newTemplate = false
  existingTemplate = false
  showDialog = false
  nameToDialog: any;
  ngOnInit(): void {
    this._BmxService.getGeneralLists()
      .subscribe((arg: any) => {
        this.settingsData = JSON.parse(arg.d);
        this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map((obj, index) => { return { index: index + 1, displayName: obj.DisplayName, templateName: obj.TemplateName, brandMatrix: obj.BrandMatrix, created: obj.LastUpdate } }) : this.TEMPLATES
        this.settingsData.OfficeList.unshift('All');
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
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch(property) {
              case 'created': return new Date(item.created);
              default: return item[property];
            }
          };
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

    return this.settingsData['SalesBoardProjectList'].filter(option => option.toLowerCase().includes(filterValue));/*.slice(0, 10);*/
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  formatDate(date: Date): string {
    return date ? date.getTime().toString() : '';
  }
  templateSelected(templateName: string, displayName: string, brandMatrix: any) {
    this.isSaveOrUpdate = true;
    this.templateName = templateName;
    const cadenaSinUnderscores = templateName.replace(/_/g, '');
    const dataString = JSON.stringify(brandMatrix);

    localStorage.setItem('displayName', displayName);
    localStorage.setItem('brandMatrix', dataString)
    this.editBM(cadenaSinUnderscores)
    localStorage.setItem('templateName', templateName)

  }
  templateSelectedUpdate(templateName: string) {
    this.isSaveOrUpdate = true;
    this.selectedTemplateName = templateName;
  }

  editBM(option: string): void {
    this._BmxService.setProjectName(option);
    var test = option;
    localStorage.setItem('templates', 'true');

    this.router.navigate(['templates-edition/99CB72BF-D163-46A6-8A0D-E1531EC7FEDC'])
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.newTemplate = false;
    this.showNewTemplateModal = false
    this.existingTemplate = false
  }

  saveNewName(newTemplate?: any) {
    this.showModal = false;
    this.newTemplate = false;
    this.existingTemplate = false
    this.showNewTemplateModal = false
    if (newTemplate) {
      this.templateName = this.newTemplateName
    } else {
      this.bmxPages = JSON.parse(this.bmxPages)
    }
    this._BmxService.getGeneralLists()
      .subscribe((arg: any) => {
        this.settingsData = JSON.parse(arg.d);
        this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map(obj => { return { templateName: obj.TemplateName, displayName: obj.DisplayName } }) : this.TEMPLATES

        // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
        this._BmxService.getGeneralLists()
          .subscribe((arg: any) => {
            this.settingsData = JSON.parse(arg.d);
            this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map((obj, index) => { return { index: index + 1, displayName: obj.DisplayName, templateName: obj.TemplateName, brandMatrix: obj.BrandMatrix, created: obj.LastUpdate } }) : this.TEMPLATES

            this.settingsData.OfficeList.unshift('All');
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
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch(property) {
                  case 'created': return new Date(item.created);
                  default: return item[property];
                }
              };
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
    this.bmxPages = ''
  }

  saveTemplateFromAnExistingOne(templateName) {
    this.loadTemplate(templateName)
  }

  loadTemplate(templateName) {
    // if (localStorage.getItem(templateName)) {
    //   this.bmxPages = JSON.parse(localStorage.getItem(templateName));
    // }
    this._BmxService.getBrandMatrixTemplateByName(templateName).subscribe((template: any) => {
      this.bmxPages = JSON.parse(template.d);
      this.saveNewName(true)
    })
    //this.openSaveTemplateBox();
  }
  deleteTemplate(templateName) {
    // if (localStorage.getItem(templateName)) {
    //   this.bmxPages = JSON.parse(localStorage.getItem(templateName));
    // }
    this.showDialog = false
    this._BmxService
      .deleteBrandMatrixTemplateByName(templateName, this.biUserId)
      .subscribe((template: any) => {
        this._snackBar.open(
          'template ' + "'" + templateName + "'" + ' deleted 😳',
          'OK',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        this._BmxService.getGeneralLists()
          .subscribe((arg: any) => {
            this.settingsData = JSON.parse(arg.d);
            this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map(obj => { return { templateName: obj.TemplateName, displayName: obj.DisplayName, brandMatrix: obj.BrandMatrix } }) : this.TEMPLATES
            this.settingsData.OfficeList.unshift('All');
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
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch(property) {
                  case 'created': return new Date(item.created);
                  default: return item[property];
                }
              };
            });
            this.currentDirectorList = this.allDirectors;
            for (var i = 0; i < this.DIRECTORS?.length; i++) {
              this.DIRECTORS[i] = this.allDirectors.find(o => o.name === this.DIRECTORS[i].name);
            }

            // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
            this._BmxService.getGeneralLists()
              .subscribe((arg: any) => {
                this.settingsData = JSON.parse(arg.d);
                this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map(obj => { return { templateName: obj.TemplateName, displayName: obj.DisplayName } }) : this.TEMPLATES

                // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
                this._BmxService.getGeneralLists()
                  .subscribe((arg: any) => {
                    this.settingsData = JSON.parse(arg.d);
                    this.TEMPLATES = (this.settingsData.BrandMatrixTemplateList.length) > 0 ? JSON.parse(arg.d).BrandMatrixTemplateList.map((obj, index) => { return { index: index + 1, displayName: obj.DisplayName, templateName: obj.TemplateName, brandMatrix: obj.BrandMatrix, created: obj.LastUpdate } }) : this.TEMPLATES

                    this.settingsData.OfficeList.unshift('All');
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
                      this.dataSource.sortingDataAccessor = (item, property) => {
                        switch(property) {
                          case 'created': return new Date(item.created);
                          default: return item[property];
                        }
                      };
                    });
                    this.currentDirectorList = this.allDirectors;
                    for (var i = 0; i < this.DIRECTORS?.length; i++) {
                      this.DIRECTORS[i] = this.allDirectors.find(o => o.name === this.DIRECTORS[i].name);
                    }

                    // END 🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 AUTOCOMPLETE
                  });
                  this.nameToDialog = ''
              });
          });
      });
  }
  closeDialog(){
    this.showDialog = false
  }

  showDialogComponent(templateName:any){
    this.showDialog = true
    this.nameToDialog = templateName
  }
}
