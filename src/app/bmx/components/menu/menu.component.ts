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
  userFullName : string = "Carlos Gomez"
  userRole : string = "Creative"
  CREATION_VIDEO_PATH: string = ''
  showCreationModalVideo:boolean = false
  hideMenu: boolean = false;
  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      
      if (event instanceof NavigationEnd) {
        // Verificar si la URL actual contiene "dashboard"
        this.isDashboardMenu = event.url.includes('dashboard') || event.url === '/' ;
      }
      if (event instanceof NavigationEnd) {
        // Verificar si la URL actual contiene "dashboard"
       this.hideMenu = event.url.includes('survey') 
         ;
      }
      
    });
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
}

  goToBmxCreator(): void {
    this.isDashboardMenu = false;

    this.router.navigate(['/bmx-creator']);
  }

  signOut(): void {
    this.router.navigate(['/login']);
  }

  navigateTo(value: string): void {
    
    if (value ==="dashboard") {
      this.isDashboardMenu = true;
    } else {
      if(value === 'project-information'){
        localStorage.clear();
      }
      this.isDashboardMenu = false;    }
      this.router.navigate(['/'+value]);   
  }

  selectMenuItem(index: number): void {
    this.selectedMenuItem = index;
  }

  navigateBack() {
    this.router.navigate(['/']); 
  }
  
}
