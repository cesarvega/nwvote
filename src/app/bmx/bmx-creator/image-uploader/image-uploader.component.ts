import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  IMAGES_UPLOADED = [
    { name: 'Image 1', rationale: 'Sist, Assist, Syst' },
    { name: 'Image 2', rationale: 'Hance, En-' },
    { name: 'Image 3', rationale: 'Evo' },
    { name: 'Image 4', rationale: 'Gard, Guard' },
    { name: 'Image 5', rationale: 'In, Inv' },
    { name: 'Image 6', rationale: 'Omni' },
    { name: 'Image 7', rationale: 'Opti, Opt, Op' },
    { name: 'Image 8', rationale: 'Shield' },
    { name: 'Image 9', rationale: 'Synch, Sync' },
    { name: 'Image 10', rationale: 'Trus, Tru' },
  ];

  AUTOSIZE_OPTIONS = [
    { name: 'Client Logo', rationale: 'Sist, Assist, Syst' },
    { name: 'Test Logo', rationale: 'Hance, En-' },
    { name: 'Diagram', rationale: 'Evo' },
    { name: 'Other', rationale: 'Gard, Guard' }
  ];

   // TEMPLATE SELECTOR VARABLES
   isTemplateSelected = '';
   isSelectedButton = '';
 
  constructor() { }

  ngOnInit(): void {
  }

}
