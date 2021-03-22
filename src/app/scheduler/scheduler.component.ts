import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { FormService } from './form.service';
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [ FormService]
})
export class SchedulerComponent implements OnInit {

  form: FormGroup;
  today: Date;
  options: FormGroup;
  callType = ['call', 'person'];
  selected = 'EST';
  call = 'call';
  time = '08:00';
  scheduleForm: any;
  isValidForm: boolean;
  items: Observable<any[]>;
  formErrors: any;
  paramsArray: any;
  email = '';
  directorId = '';



  date: Date = new Date();
	settings = {
		bigBanner: true,
		timePicker: false,
		format: 'dd-MM-yyyy',
		defaultOpen: true,
    closeOnSelect : false
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


  constructor(private _formBuilder: FormBuilder,
    public _FormService: FormService,
    private _route: Router,
    private paramsRouter: ActivatedRoute) { 

      
    this.today = new Date();
    this.formErrors = {
        company: {},
        firstName: {},
        lastName: {},
        email: {},
        phone: {},
        date: {},
        time: {},
        timeZone: {},
        type: {},
        note: {},
        address: {},
        city: {},
        // state: {},
        contry: {},            
        // postalcode: {},            
    };
    }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      company: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      timeZone: ['', Validators.required],
      type: ['', Validators.required],
      note: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      country: ['', Validators.required],            
      postalcode: ['']            
  });

  this.paramsRouter.queryParams
            .subscribe(params => {
                if (params.value) {
                    this.paramsArray = params.value.split(',');
                    this.directorId = this.paramsArray[1]; 
                    this.email = this.paramsArray[0];
                }
            });

  }

  onSubmit(): void {
    this.form.value.date = this.form.value.date.toString();
    this._FormService.markFormGroupTouched(this.form);
    if (this.form.valid) {
        this._FormService.addEmailAppointment(this.form.value, this.email, this.directorId).subscribe(result => {
            this.form.reset();
            this._route.navigateByUrl('form/thankyou');
        });
    } else {
        this.formErrors = this._FormService.validateForm(this.form, this.formErrors, false);
    }
}

  onDateSelect(e){
    console.log(

      e
    );
    
  }


}
