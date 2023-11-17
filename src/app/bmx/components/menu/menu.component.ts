import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BmxService } from '../bmx-creator/bmx.service';

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
  userName= ''
  userDepartment: string;
  userOffice: any;
  
  constructor(private router: Router, private location: Location, private _BmxService: BmxService, private activatedRoute: ActivatedRoute,) { 
    this.activatedRoute.params.subscribe((params) => {
      this.userGUI = params['id'];

      // localStorage.setItem('projectId', this.projectId);
      this._BmxService.getMatrixUser(this.userGUI).subscribe((data: any) => {
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
      });
    });

  }

  ngOnInit(): void {

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.isDashboardMenu = event.url.includes('dashboard') || event.url === '/';
        this.isPreviewView = event.url.includes('survey')
        this.selectedMenuItem = event.url.slice(1)
        this.login = event.url.includes('login')
      }

    });
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
    this.selectedMenuItem=value;
    if (value === "dashboard") {
      this.isDashboardMenu = true;
    } else if (value.includes('bmx-creation')) {
      this.hideMenu = true;
    }
    else {
      if (value === 'project-information') {
        localStorage.clear();
      }
      this.isDashboardMenu = false;
    }
    this.router.navigate(['/' + value]);
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

}
