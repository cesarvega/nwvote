import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { BmxService } from './bmx.service';
import { Router, ActivatedRoute } from '@angular/router';
import Speech from 'speak-tts';


@Component({
  selector: 'app-bmx',
  templateUrl: './bmx.component.html',
  styleUrls: ['./bmx.component.scss']
})
export class BmxComponent implements OnInit {

  projectName = 'PROJECT NAME';
  userName = 'Alexa';
  isGoVoteOn = false;
  projectId: any;
  constructor(private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      localStorage.setItem('projectId',  this.projectId);
      // this.bsrService.getProjectData(this.projectId).subscribe(arg => {
      //   this.projectName = JSON.parse(arg[0].bsrData).projectdescription;
      //   localStorage.setItem('projectName',  this.projectId);        
      // });
    });
   }

  ngOnInit(): void {
  }

  
  goVote(){
    this.isGoVoteOn = ! this.isGoVoteOn;
  }

}
