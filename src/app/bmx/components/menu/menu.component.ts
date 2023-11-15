import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isMenuVisible: boolean = true;
  selectedMenuItem: number | null = null;
  isDashboardMenu: boolean = true;
  userFullName: string = "Carlos Gomez"
  userRole: string = "Creative"
  CREATION_VIDEO_PATH: string = ''
  showCreationModalVideo: boolean = false
  hideMenu: boolean = false;
  showMenu: boolean = false;
  isPreviewView: boolean = true
  login = true
  constructor(private router: Router, private location: Location) { }

  ngOnInit(): void {

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.isDashboardMenu = event.url.includes('dashboard') || event.url === '/';
        this.isPreviewView = event.url.includes('survey')
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

  selectMenuItem(index: number): void {
    this.selectedMenuItem = index;
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

}
