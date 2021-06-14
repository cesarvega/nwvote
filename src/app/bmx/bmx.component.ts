import { Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { BmxService } from './bmx.service';
import { Router, ActivatedRoute } from '@angular/router';
import Speech from 'speak-tts';

import { keyframes, animate, state, style } from '@angular/animations';


@Component({
  selector: 'app-bmx',
  templateUrl: './bmx.component.html',
  styleUrls: ['./bmx.component.scss'],
  animations: [
    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0
        })
      ),
      transition("void <=> *", animate(900))
    ]),
  ]
})
export class BmxComponent implements OnInit {

  slideToLogin: boolean;

  projectName = 'PROJECT NAME';
  userName = 'Alexa';
  isGoVoteOn = false;
  projectId: any;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
   // our list of avatars

   
   avatars = [
    {
        name: 'kristy',
        image: 'http://semantic-ui.com/images/avatar2/large/kristy.png',
        visible: true
    },
    {
        name: 'matthew',
        image: 'http://semantic-ui.com/images/avatar2/large/matthew.png',
        visible: false
    },
    {
        name: 'chris',
        image: 'http://semantic-ui.com/images/avatar/large/chris.jpg',
        visible: false
    },
    {
        name: 'jenny',
        image: 'http://semantic-ui.com/images/avatar/large/jenny.jpg',
        visible: false
    }
];


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

   emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

   onSwipe(evt) {
    const x = Math.abs(evt.deltaX) > 20 ? (evt.deltaX > 0 ? 'swipeRight' : 'swipeLeft'):'';
    console.log(x);
    if (x === 'swipeRight') {
      this.slideToLogin = true;
      }else if (x === 'swipeLeft') {
        this.slideToLogin = false; 
      }
    }

  ngOnInit(): void {
    window.scrollTo(0, 1);
  }

  
  goVote(){
    this.isGoVoteOn = ! this.isGoVoteOn;
  }

   // action triggered when user swipes
   swipe(currentIndex: number, action = this.SWIPE_ACTION.RIGHT) {
    // out of range
    if (currentIndex > this.avatars.length || currentIndex < 0) return;

    let nextIndex = 0;

    // swipe right, next avatar
    if (action === this.SWIPE_ACTION.RIGHT) {
        const isLast = currentIndex === this.avatars.length - 1;
        nextIndex = isLast ? 0 : currentIndex + 1;
    }

    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
        const isFirst = currentIndex === 0;
        nextIndex = isFirst ? this.avatars.length - 1 : currentIndex - 1;
    }

    // toggle avatar visibility
    this.avatars.forEach((x, i) => x.visible = (i === nextIndex));
}

}
