import { Component, OnInit } from '@angular/core';
import { EliteAuthService } from './elite-auth.service';

@Component({
  selector: 'app-elite-auth',
  templateUrl: './elite-auth.component.html',
  styleUrls: ['./elite-auth.component.scss']
})
export class EliteAuthComponent implements OnInit {

  constructor(public auth: EliteAuthService) { }

  ngOnInit(): void {
  }

}
