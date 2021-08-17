import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-elite-business-card',
  templateUrl: './elite-business-card.component.html',
  styleUrls: ['./elite-business-card.component.scss']
})
export class EliteBusinessCardComponent implements OnInit {
  isGoVoteOn = false;
  isRadialMenuOn = true;

  constructor() { }

  ngOnInit(): void {
  }
  goVote() {
    this.isGoVoteOn = !this.isGoVoteOn;
  }

}
