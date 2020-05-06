import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-bsr',
  templateUrl: './bsr.component.html',
  styleUrls: ['./bsr.component.scss']
})
export class BsrComponent implements OnInit {
  slideBackground = 'background-image: url(http://www.bipresents.com/bsr_slides/TEST_BI_ALEXA/thumbnails/001.jpg);';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  constructor() { }

  ngOnInit(): void {
  }

}
