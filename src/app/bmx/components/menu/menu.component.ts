import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BmxService } from '../bmx-creator/bmx.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BMX_STORE as BMX_STORE } from 'src/app/signals/+store/brs.store';
import { signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  readonly bmxStore = inject(BMX_STORE);

  isMenuVisible: boolean = true;
  isDashboardMenu: boolean = true;
  userFullName: string = "Carlos Gomez"
  userRole: string = "Creative"
  CREATION_VIDEO_PATH: string = ''
  showCreationModalVideo: boolean = false
  hideMenu: boolean = false;
  showMenu: boolean = true;
  isPreviewView: boolean = false
  login = false
  selectedMenuItem: string = 'dashboard';
  userGUI: any;
  userName = ''
  userDepartment: string;
  userOffice: any;
  id: string;
  versionNumber = 'v1.0.10';
  showErrorMessage = false;

  // constructor(private router: Router, private _BmxService: BmxService, private activatedRoute: ActivatedRoute,) {

  projectId: string;
  globalProjectName: string;
  count = signal(0);
  // appStore = defineSignalStore({
  //   count: signal(0)
  // });

  constructor(private router: Router, private location: Location, private _BmxService: BmxService, private activatedRoute: ActivatedRoute, public _snackBar: MatSnackBar, private msalService: MsalService,) {

  }

  ngOnInit(): void {
    this.msalService.initialize()
    //   if (location.search) {

    //     const searchParams = new URLSearchParams(location.search);
    //     const obj: any = {};
    //     searchParams.forEach((value, key) => {
    //       obj[key] = value;
    //     });

    //     this.bmxStore.updateUrlSearchParams(obj);

    //     // const firstName = this.bmxStore.urlSearchParams().firstName();

    //     if (
    //         this.bmxStore.urlSearchParams()?.agentId === undefined ||
    //         this.bmxStore.urlSearchParams()?.agentId === null
    //     ) {
    //         this.bmxStore.updateMessageInfo({
    //             message: 'Data not found',
    //             description: 'Data not found in foot print.',
    //             icon: 'info',
    //             display: true
    //         });
    //         return;
    //     }

    //     this.bmxStore.updateMessageInfo({
    //       message: 'Data not found',
    //       description: 'Data not found in foot print.',
    //       icon: 'info',
    //       display: true
    //   });
    // }

    //clean local storage
    this.router.events.subscribe((event) => {
      const account = this.msalService.instance.getActiveAccount()
      if (account) {
        this.userFullName = account.name
        this.userName = account.username
        this.showErrorMessage = false
      }
        this.id = this.activatedRoute.snapshot.queryParamMap.get('id');
        if (event instanceof NavigationEnd) {

        // localStorage.setItem('projectId', this.projectId);
        this._BmxService.getMatrixUser(this.userName).subscribe((data: any) => {
          if (data.d) {
            data = JSON.parse(data.d);
            localStorage.setItem('userData', JSON.stringify(data))
            this.userFullName = data.FullName;
            this.userRole = data.Role;
            this.userName = data.UserName;
            this.userOffice = data.Office;
            this.userDepartment = data.Role;
            this.showErrorMessage = false
          }

        });
        this.isDashboardMenu = event.url.includes('dashboard') || event.url === '/' || event.url.includes('templates');

        if (this.userGUI) {
          localStorage.setItem('userGui', this.userGUI);
        } else {
          this.userGUI = localStorage.getItem('userGui')
        }
        if (this.userGUI) {
          this._BmxService.getMatrixUser(this.userName).subscribe((data: any) => {       
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
              this.showErrorMessage = false
            }
          });
        } else {
          const userData = JSON.parse(localStorage.getItem('userData'))
          this.userFullName = userData.name
          this.userName = userData.username
          this.showErrorMessage = false
        }
        this.isDashboardMenu = event.url.includes('dashboard') || event.url === '/' || event.url.includes('templates');
        this.isPreviewView = event.url.includes('survey')
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


  navigateTo(value: string): void {
    this.selectedMenuItem = value;
    if (value === "dashboard") {
      localStorage.clear()
      this.isDashboardMenu = true;
      this.router.navigate(['/' + value]);
    } else if (value === 'templates') {
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
signOut() {
  this.msalService.logoutPopup().subscribe({
    next: (response: any) => {
      if (response) {
        sessionStorage.clear()

      }
      this.router.navigate(['/login']);
    },
    error: (err: any) => {
      sessionStorage.clear()
      console.error('Error during logout:', err);
      this.router.navigate(['/login']);
    }

  });
}
  
}
