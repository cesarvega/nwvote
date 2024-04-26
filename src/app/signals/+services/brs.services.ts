import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Baseline} from "../+models/baseline";
import {Internet} from "../+models/internet";

@Injectable({
  providedIn: 'root'
})
export class BrsService {

  constructor(private http: HttpClient) {
  }

  hasBrsError(value: any){
    return value.messageStatus && value.messageStatus[0] !== undefined && value.messageStatus[0].internalStatusCode !== ''
  }

  generateTransation(transaction: any) {
    const url = environment.apiUrl + '/api/transaction';

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(transaction)
    });
  }

  addressQualification(addressQualification: any, transactionId: string) {
    const url = environment.apiUrl + '/api/brightspeed/v2/address-qualification';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'transaction-id': transactionId
    });
    return this.http.post(url, addressQualification, {headers})
  }

  internet(baseline: Baseline, internet: Internet, transactionId: string) {
    const url = environment.apiUrl + '/api/brightspeed/v2/internet';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'transaction-id': transactionId
    });
    return this.http.post(url, {baseline: baseline, productRequest: internet}, {headers})
  }
}
