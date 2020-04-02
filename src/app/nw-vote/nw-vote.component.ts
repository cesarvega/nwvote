import { Component, OnInit } from '@angular/core';
import { NwvoteService } from './nwvote.service';


@Component({
  selector: 'app-nw-vote',
  templateUrl: './nw-vote.component.html',
  styleUrls: ['./nw-vote.component.scss']
})
export class NwVoteComponent implements OnInit {
  name = '';
  positiveVote = false;
  negativeVote = false;
  neutralVote = false;
  isUser=false;
  constructor(public NwvoteService: NwvoteService) { }

  ngOnInit(): void {
    this.callNewName();
    setInterval(() => {
      this.callNewName();
    }, 3000);

  
  }

  callNewName() {
    this.NwvoteService.getName().subscribe((res: any) => {
      console.log(res);
      // this.positiveVote = false;
      // this.negativeVote = false;
      // this.neutralVote = false;
      this.name = JSON.parse(res.d)[0].currentName;
    });

  }
  setPositive() {
    this.sendVote('positive');
    this.positiveVote = true;
    this.negativeVote = false;
    this.neutralVote = false;
  }

  setNegative() {
    this.sendVote('negative');
    this.positiveVote = false;
    this.negativeVote = true;
    this.neutralVote = false;
  }

  setNeutral() {
    this.sendVote('neutral');
    this.positiveVote = false;
    this.negativeVote = false;
    this.neutralVote = true;
  }

  sendVote(vote: string) {
    this.NwvoteService.voteName(this.name, vote).subscribe((res: any) => {
      console.log(res);    
    });
  }

}
