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
  userName = ''
  userDepartment: string;
  userOffice: any;
  id: string;

  constructor(private router: Router, private _BmxService: BmxService, private activatedRoute: ActivatedRoute,) {


  }

  ngOnInit(): void {

    //clean local storage
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.id = this.activatedRoute.snapshot.queryParamMap.get('id');

        // localStorage.setItem('projectId', this.projectId);
        this._BmxService.getMatrixUser(this.id).subscribe((data: any) => {
          data = JSON.parse(data.d);
          localStorage.setItem('userData', JSON.stringify(data))
          this.userFullName = data.FullName;
          this.userRole = data.Role;
          this.userName = data.UserName;
          this.userOffice = data.Office;
          this.userDepartment = data.Role;
        });
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
    this.selectedMenuItem = value;
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
