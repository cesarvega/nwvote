import { Component, OnInit } from '@angular/core';
import { NwvoteService } from './nwvote.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nw-vote',
  templateUrl: './nw-vote.component.html',
  styleUrls: ['./nw-vote.component.scss']
})
export class NwVoteComponent implements OnInit {
  name = '';
  readOnlyName = false;
  projectName = '';
  userToken = '';
  progressBarCompletion = '0';
  progressBarValue = '0';
  positiveVote = false;
  negativeVote = false;
  neutralVote = false;
  constructor(public NwvoteService: NwvoteService, private router: Router) { }

  ngOnInit(): void {
    this.callNewName();
    setInterval(() => {
      this.callNewName();
    }, 3000);
    this.projectName = localStorage.getItem('project');
    this.userToken = localStorage.getItem('userTokenId');
    if (!this.userToken && !this.name) {
      this.router.navigate(['/', 'login']);
    }

  }

  callNewName() {
    this.NwvoteService.getName().subscribe((res: any) => {
      // console.log(res);
      if (this.name !== JSON.parse(res.d)[0].currentName) {
        this.positiveVote = false; 
        this.negativeVote = false;
        this.neutralVote = false;
      }
   
      this.name = JSON.parse(res.d)[0].currentName;
      this.readOnlyName = (JSON.parse(res.d)[0].readOnly === 1)?true:false;
      this.go = this.readOnlyName ;
      this.progressBarCompletion = 'width: ' + JSON.parse(res.d)[0].completion + '%' ;
      this.progressBarValue = JSON.parse(res.d)[0].completion;
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
