import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
@Injectable()
export class FormService {

  protected ASMX_URL_AddEmailAppointment = 'https://tools.brandinstitute.com/wsPanelMembers/wsPanel.asmx/addEmailAppointment';
  // protected ASMX_URL_AddEmailAppointment = 'http://localhost:55833/wsPanel.asmx/addEmailAppointment';

  constructor(private httpClient: HttpClient) { }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      console.log(control.value);      
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }


  validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean): void {
    const form = formToValidate;
    for (const field in formErrors) {
      if (field) {
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              if (key && key !== 'invalid_characters') {
                formErrors[field] = formErrors[field];
              } else {
                formErrors[field] = formErrors[field];
              }
            }
          }
        }
      }
    }
    return formErrors;
  }

  addEmailAppointment(data: any, clientEmail: any, DirectorId: any): Observable<any> {
    const formatDate  = moment(data.date).format('MM/DD/YYYY');
    const dateTime: any = moment(formatDate + ' ' + data.time);
    const dataContainer = {
      DirectorId: (DirectorId !== '') ? DirectorId : '000000',
      Company: data.company.replace(/'/g, '`'),
      FirstName: data.firstName.replace(/'/g, '`'),
      LastName: data.lastName.replace(/'/g, '`'),
      Clientemail: data.email.replace(/'/g, '`'),
      Phone: data.phone,
      AppDate: dateTime._i,
      TimeZone: data.timeZone,
      AppType: data.type,
      Notes: data.note.replace(/'/g, '`'),
      Address: data.address.replace(/'/g, '`'),
      City: data.city.replace(/'/g, '`'),
      State: data.state.replace(/'/g, '`'),
      Country: data.country.replace(/'/g, '`'),
      Postalcode: data.postalcode,
      Title: 'Mr/Miss',
    };
    return this.httpClient.post(this.ASMX_URL_AddEmailAppointment, dataContainer);
  }
}
