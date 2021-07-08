import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse, flash } from 'ng-animate';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import Speech from 'speak-tts';
// import { Nw3Service } from './nw3.service';
import { ActivatedRoute } from '@angular/router';
import { typeSourceSpan } from '@angular/compiler';
import { Nw3Service } from '../nw3/nw3.service';

@Component({
  selector: 'app-bmx-creator',
  templateUrl: './bmx-creator.component.html',
  styleUrls: ['./bmx-creator.component.scss']
})
export class BmxCreatorComponent implements OnInit {
  projectName: any;
  projectId: any;
  soundVolume = 0.2;
  

  constructor(@Inject(DOCUMENT) private document: any,
    private _NW3Service: Nw3Service, private activatedRoute: ActivatedRoute,
    private _hotkeysService: HotkeysService) {

    this.activatedRoute.params.subscribe(params => {
      this.projectName = params['id'];
      localStorage.setItem('projectName', this.projectName);
      this._NW3Service.getProjectId(this.projectName).subscribe((data: any) => {
        this.projectId = data[0].PresentationId;
        localStorage.setItem('data', data[0].PresentationId);
      })
    });

    this._hotkeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {  
      return false;
    }, undefined, 'Move to next slide'));
    this._hotkeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
      this.playSound('03 Primary System Sounds/navigation_backward-selection-minimal.wav', this.soundVolume);
      return false;
    }, undefined, 'Move to previous slide'));
    this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {     
      return false;
    }, undefined, 'Show menu'));
    this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {      
      return false;
    }, undefined, 'Hide menu'));
    this._hotkeysService.add(new Hotkey('o', (event: KeyboardEvent): boolean => {     
      return false;
    }, undefined, 'Hide/Show slide overview'));
    this._hotkeysService.add(new Hotkey('b', (event: KeyboardEvent): boolean => {    
      return false;
    }, undefined, 'Remove background'));
    this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {     
      return false;
    }, undefined, 'Show stock ticker'));
    this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {      
      return false;
    }, undefined, 'Hide help sheet'));
    this._hotkeysService.add(new Hotkey('shift+r', (event: KeyboardEvent): boolean => {      
      return false;
    }, undefined, ''));
    this._hotkeysService.add(new Hotkey('1', (event: KeyboardEvent): boolean => {     
      return false;
    }, undefined, 'Set slide to positive'));
    this._hotkeysService.add(new Hotkey('2', (event: KeyboardEvent): boolean => {      
      return false;
    }, undefined, 'Set slide to neutral'));
    this._hotkeysService.add(new Hotkey('3', (event: KeyboardEvent): boolean => {      
      return false;
    }, undefined, 'Set slide to negative'));
    this._hotkeysService.add(new Hotkey('4', (event: KeyboardEvent): boolean => {      
      return false;
    }, undefined, 'Set slide to recraft'));

 
    // document.body.style.zoom = 1.10;

  }

  ngOnInit(): void {
   
  }

  playSound(soundEffect, volume) {
    let audio = new Audio();
    // audio.src = soundEffect;
    // audio.volume = volume;
    audio.src = "assets/sound/wav/" + soundEffect;
    audio.volume = volume;
    audio.load();
    audio.play();
  }
}