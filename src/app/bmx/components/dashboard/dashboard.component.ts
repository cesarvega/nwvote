import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BmxService } from '../bmx-creator/bmx.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userData: any ;

  constructor( private activatedRoute: ActivatedRoute,  private _BmxService: BmxService) { }

  ngOnInit(): void {
   this.userData =  localStorage.getItem('userData')
   this.userData = JSON.parse(this.userData)
  }

}
