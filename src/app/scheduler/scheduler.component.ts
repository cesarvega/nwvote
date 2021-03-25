<<<<<<< HEAD
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit, ViewChild } from '@angular/core';
>>>>>>> 196f42ef93571f2a91232bbfad8dc6e6ba131336
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker'
import { FormService } from './form.service';
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [FormService]
})
export class SchedulerComponent implements OnInit {

  form: FormGroup;
  today: Date;
  options: FormGroup;
<<<<<<< HEAD
  callType = ['call', 'person'];
  selected = 'myTz';
=======
  callType = ['New Project Discussion', 'INN/USAN', 'Introduction'];
  selected;
>>>>>>> 196f42ef93571f2a91232bbfad8dc6e6ba131336
  call = 'call';
  time = '08:00';
  scheduleForm: any;
  isValidForm: boolean;
  items: Observable<any[]>;
  formErrors: any;
  paramsArray: any;
  email = '';
  directorId = '';
  indexTabCounter = 0;
  desableNextButton = true;

  selectedIndex: number = 0;

  isNextTab = true;
  desablePrevioustButton = false;
  disablePersonalInfoTab = true;
  isForm = true;
  isThankyou = false;


  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: false,
    format: 'dd-MM-yyyy',
    defaultOpen: true,
    closeOnSelect: false
  }

  times: any[] = [];
  validForm = false;
  emptyFormFields = [];
  formAlert = false;
  selectTimeConfirm = false;
  selectTimeConfirmIndex;
  MinDate =  new Date();

  timeZoneOption = [{value: 'EDT', name: 'Eastern Daylight Time (EDT)'}, {value: 'EST', name: 'Eastern Time (EST)'}, {value: 'CST', name: 'Central Time (CST)'}, {value: 'MT', name: 'Mountain Time (MT)'}, 
  {value: 'PST', name: 'Pacific Time (PST)'}, {value: 'WET', name: 'Western European Time (WET)'}, {value: 'CET', name: 'Central European Time (CET)'}, {value: 'EET', name: 'Eastern European Time (EET)'},
  {value: 'JPT', name: 'Japan Time (JPT)'}, {value: 'KST', name: 'Korea Time (KST)'}, {value: 'BRT', name: 'Brasilia Time (BRT)'}]

  @ViewChild(MatDatepicker) private theTimePicker: MatDatepicker<Date>;
  constructor(private _formBuilder: FormBuilder,
    public _FormService: FormService,
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

    // this.form = this._formBuilder.group({
    //   company: ['BI', Validators.required],
    //   firstName: ['Cesar', Validators.required],
    //   lastName: ['Vega', Validators.required],
    //   email: ['cvega@brandinstitute.com', Validators.email],
    //   phone: ['3053228822', Validators.required],
    //   date: [new Date, Validators.required],
    //   time: ['10:00 PM', Validators.required],
    //   timeZone: ['EAST', Validators.required],
    //   type: [''],
    //   // type2: ['', Validators.required],
    //   note: ['Notas', Validators.required],
    //   address: ['201 se 2 ave', Validators.required],
    //   city: ['Miami', Validators.required],
    //   state: ['Fl'],
    //   country: ['USA', Validators.required],
    //   postalcode: ['33131']
    // });

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
      // type2: ['', Validators.required],
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

      this.searchTime(new Date().getDate())

      this.timeZoneOption.push({value:'GMT' + new Date().toString().split('GMT')[1], name: 'GMT' + new Date().toString().split('GMT')[1]}) ;
      this.selected = 'GMT' + new Date().toString().split('GMT')[1];
  }

  _openCalendar(picker: MatDatepicker<Date>, direction) {
    let timeInterval = 0;
    if (direction === 'prev') {
      timeInterval = 500;
    }
    if (this.isNextTab) {   
      setTimeout(() => {        
        picker.open();
      }, timeInterval);   
    }else {
      picker.close();
    }
  }

  _closeCalendar(picker: MatDatepicker<Date>) {
    picker.close();
  }


  searchTime(date?){
    this.times  =[{
      "name": 'Not Time Avilable for '+ date
    }]
    if (date !== new Date().getDate()) {
      this.times  =[
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
        },
        {
          "name": "2:30 PM"
        },
        {
          "name": "3:00 PM"
        },
        {
          "name": "3:30 PM"
        },
        {
          "name": "4:00 PM"
        },
        {
          "name": "4:30 PM"
        },
        {
          "name": "5:00 PM"
        },
        {
          "name": "5:30 PM"
        },
        {
          "name": "6:00 PM"
        },
        {
          "name": "6:30 PM"
        },
        {
          "name": "7:00 PM"
        },
        {
          "name": "7:30 PM"
        },
        {
          "name": "8:00 PM"
        },
        {
          "name": "8:30 PM"
        }
      ];
    }


  }

  onSubmit(): void {
    this.form.value.date = this.date.toString();
    // this._FormService.markFormGroupTouched(this.form);


    // this.form.value.forEach(field => {
    //   if ${this.form.value[property]} !== "") {
    //     this.validForm = true;
    //   }else{
    //     this.validForm = false;
    //   }
    // });
    this.emptyFormFields = [];
    this.validForm = false;
    for (const property in this.form.value) {

      console.log(`${property}: ${this.form.value[property]}`);
      if (`${this.form.value[property]}` !== "") {
        this.validForm = true;
      } else {
        this.validForm = false;
        this.emptyFormFields.push(property)
        this.formAlert = true;
      }
    }

    if (this.validForm) {
      this._FormService.addEmailAppointment(this.form.value, this.email, this.directorId).subscribe(result => {
        // this.form.reset();
        // this._route.navigateByUrl('thankyou');
        this.isForm = false;
        this.isThankyou = true;
      });
    } else {
      this.formErrors = this._FormService.validateForm(this.form, this.formErrors, false);
    }
  }

  onDateSelect(e) {
    console.log("date: " + e.value);
    this.date =  e.value;
    this.searchTime(e.value.getDate());
  }

  dismissErrorForm() {
    this.formAlert = false;
  }

  previousStep() {
    if (this.indexTabCounter > 0) {
      this.indexTabCounter = this.indexTabCounter - 1;
      this.selectedIndex = 0;
      this.isNextTab = true;
    }
    console.log(this.indexTabCounter);
  }

  nextStep() {
    if (this.indexTabCounter < 2) {
      this.indexTabCounter = 1 + this.indexTabCounter;
      this.selectedIndex = 1;
      this.disablePersonalInfoTab = false;
      this.isNextTab = false;
      this._closeCalendar(this.theTimePicker);
    }
    console.log(this.indexTabCounter);
  }


  radioChange(time) {
    this.form.value.time = time
    this.time = this.form.value.time;
    if (this.form.value.time) {
      this.desableNextButton = false;
    }
    this. nextStep();
    console.log(time);
  }



  makeAnother() {
    window.location.reload();
  }

<<<<<<< HEAD
  edtTimeZone = new Date();
  cstTimeZone = new Date();
         from = new DatePipe('en-Us').transform(this.cstTimeZone, '') 

  timeZoneOption = [{value: 'myTz', name: this.edtTimeZone}, {value: 'EST', name: 'Eastern Time (EST)'}, {value: 'CST', name: 'Central Time (CST)'}, {value: 'MT', name: 'Mountain Time (MT)'}, 
  {value: 'PST', name: 'Pacific Time (PST)'}, {value: 'WET', name: 'Western European Time (WET)'}, {value: 'CET', name: 'Central European Time (CET)'}, {value: 'EET', name: 'Eastern European Time (EET)'},
  {value: 'JPT', name: 'Japan Time (JPT)'}, {value: 'KST', name: 'Korea Time (KST)'}, {value: 'BRT', name: 'Brasilia Time (BRT)'}]

} 

=======
}
>>>>>>> 196f42ef93571f2a91232bbfad8dc6e6ba131336
