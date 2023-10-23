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
  
  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verificar si la URL actual contiene "dashboard"
        this.isDashboardMenu = event.url.includes('dashboard');
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
      this.isDashboardMenu = false;    }
      this.router.navigate(['/'+value]);   
  }

  selectMenuItem(index: number): void {
    this.selectedMenuItem = index;
  }

  navigateBack() {
    this.location.back();
  }
  
}
