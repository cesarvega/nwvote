import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-video',
  templateUrl: './show-video.component.html',
  styleUrls: ['./show-video.component.scss']
})

export class ShowVideoComponent implements OnInit {

  videoPath= '/assets/img/bmx/tutorial/imageq.jpg';
  showModalVideo: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
