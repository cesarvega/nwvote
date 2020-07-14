import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-fcastillo',
  templateUrl: './fcastillo.component.html',
  styleUrls: ['./fcastillo.component.scss']
})
export class FcastilloComponent implements OnInit {
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  constructor() { }

  ngOnInit(): void {
    const video: HTMLVideoElement = this.videoplayer.nativeElement;
 video.play();
    // this.videoplayer.nativeElement.play();
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
}
}
