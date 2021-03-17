import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  date: Date = new Date();
	settings = {
		bigBanner: true,
		timePicker: false,
		format: 'dd-MM-yyyy',
		defaultOpen: true
	}

  people: any[] = [
    {
      "name": "12:00 PM"
    },
    {
      "name": "12:30 PM"
    },
    {
      "name": "1:00 PM"
    },
    {
      "name": "1:30 PM"
    },
    {
      "name": "2:00 PM"
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }



}
