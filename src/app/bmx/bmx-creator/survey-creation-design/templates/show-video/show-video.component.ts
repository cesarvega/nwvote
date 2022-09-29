import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-video',
  templateUrl: './show-video.component.html',
  styleUrls: ['./show-video.component.scss']
})

export class ShowVideoComponent implements OnInit {

  videoPath= '/assets/img/bmx/Robot.mp4';
  showModalVideo: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
