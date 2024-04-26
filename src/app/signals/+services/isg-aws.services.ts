import {inject, Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BrightspeedStore} from "../+store/brs.store";
import {async, map, switchMap, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IsgAwsServices {

  readonly brsStore = inject(BrightspeedStore);

  constructor(private http: HttpClient) {
  }

  getSaleCode(dnis: string,) {
    const url = environment.apiUrl + '/api/marketing_info';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.brsStore.isgAwsToken()}`
    });

    const body = {'dnis': dnis, 'provider': environment.provider, 'return_full_json': '1'};
    return this.http.post(url, body, {headers});
  }

  getToken() {
    const url = environment.apiUrl + '/api/token';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(url, {'email': environment.email, 'password': environment.password}, {headers});
  }

}
