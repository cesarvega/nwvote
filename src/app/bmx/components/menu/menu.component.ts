import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BmxService } from '../bmx-creator/bmx.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isMenuVisible: boolean = true;
  isDashboardMenu: boolean = true;
  userFullName: string = "Carlos Gomez"
  userRole: string = "Creative"
  CREATION_VIDEO_PATH: string = ''
  showCreationModalVideo: boolean = false
  hideMenu: boolean = false;
  showMenu: boolean = false;
  isPreviewView: boolean = true
  login = true
  selectedMenuItem: string = 'dashboard';
  userGUI: any;
  userName = ''
  userDepartment: string;
  userOffice: any;
  id: string;
  versionNumber = 'v1.0.15';

  // constructor(private router: Router, private _BmxService: BmxService, private activatedRoute: ActivatedRoute,) {

  projectId: string;
  globalProjectName: string;

  constructor(private router: Router, private location: Location, private _BmxService: BmxService, private activatedRoute: ActivatedRoute, public _snackBar: MatSnackBar,) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.userGUI = queryParams['id'];

      // localStorage.setItem('projectId', this.projectId);
      this._BmxService.getMatrixUser(this.userGUI).subscribe((data: any) => {
        if (data.d != '') {
          data = JSON.parse(data.d);
          this.userName = data.UserName;
          this.userFullName = data.FullName;
          this.userOffice = data.Office;
          this.userRole = data.Role;
          this.userDepartment = data.Role;

          // TEST DATA
          // this.userOffice = 'Miami';
          // this.userRole = 'admin'; // no restrictions
          // this.userDepartment = 'Creative';
          // this.userOffice = 'Basel 1'
          // this.userRole = 'director'; // director restriced
          // this.userRole = 'creative';
          // this.userRole = 'user'
          // this.userDepartment = 'Design'
        }
      });

    });

  }

  ngOnInit(): void {

    //clean local storage
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.id = this.activatedRoute.snapshot.queryParamMap.get('id');

        // localStorage.setItem('projectId', this.projectId);
        this._BmxService.getMatrixUser(this.id).subscribe((data: any) => {
          if(data.d){
            data = JSON.parse(data.d);
            localStorage.setItem('userData', JSON.stringify(data))
            this.userFullName = data.FullName;
            this.userRole = data.Role;
            this.userName = data.UserName;
            this.userOffice = data.Office;
            this.userDepartment = data.Role;
          }

        });
        this.isDashboardMenu = event.url.includes('dashboard') || event.url === '/' || event.url.includes('templates') ;
        this.isPreviewView = event.url.includes('survey')
        this.selectedMenuItem = event.url.slice(1)
        this.login = event.url.includes('login')
      }

    });
    if (localStorage.getItem('projectName')) {
      this.projectId = localStorage.getItem('projectName');
      this.globalProjectName = this.projectId
    } else {
      this._BmxService.currentProjectName$.subscribe(projectName => {
        this.projectId = (projectName !== '') ? projectName : this.projectId;

        localStorage.setItem('projectName', this.projectId);
      })
    }
  }


  toggleMenu() {
    this.hideMenu = !this.hideMenu;
  }

  goToBmxCreator(): void {
    this.isDashboardMenu = false;

    this.router.navigate(['/bmx-creator']);
  }

  signOut(): void {
    this.router.navigate(['/login']);
  }

  navigateTo(value: string): void {
    this.selectedMenuItem = value;
    if (value === "dashboard") {
      localStorage.clear()
      this.isDashboardMenu = true;
      this.router.navigate(['/' + value]);
    }else if(value === 'templates'){
      localStorage.clear()
      this.isDashboardMenu = true;
      this.router.navigate(['/' + value]);
    }
    else if (value.includes('bmx-creation')) {

      if (localStorage.getItem('projectName')) {
        this.projectId = localStorage.getItem('projectName');
        this.globalProjectName = this.projectId
        if (this.globalProjectName != null && this.globalProjectName != 'null') {
          this.hideMenu = true;

          this.router.navigate(['/' + value]);
        } else {
          this._snackBar.open(
            'Select a project or save information for a new one', 'OK',
            {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        }
      } else {
        this._BmxService.currentProjectName$.subscribe(projectName => {
          this.globalProjectName = (projectName !== '') ? projectName : this.projectId;
          if (this.globalProjectName != null && this.globalProjectName != 'null') {
            this.hideMenu = true;

            this.router.navigate(['/' + value]);
          } else {
            this._snackBar.open(
              'Select a project or save information for a new one', 'OK',
              {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              }
            );
          }
        })
      }


    }
    else {
      if (value === 'project-information') {
      }
      this.isDashboardMenu = false;
      this.router.navigate(['/' + value]);
    }

  }

  navigateBack() {
    this.router.navigate(['/']);
  }

}
