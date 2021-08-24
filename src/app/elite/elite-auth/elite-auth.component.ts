import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EliteAuthService } from './elite-auth.service';

@Component({
  selector: 'app-elite-auth',
  templateUrl: './elite-auth.component.html',
  styleUrls: ['./elite-auth.component.scss']
})
export class EliteAuthComponent implements OnInit {

  constructor(public auth: EliteAuthService,private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/business-card']);
  }

}
