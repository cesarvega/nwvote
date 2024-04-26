import {inject, Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BrightspeedStore} from "../+store/brs.store";

@Injectable({
  providedIn: 'root'
})
export class IsgAwsTokenServices {
  constructor(private http: HttpClient) {
  }

  getToken() {
    const url = environment.apiUrl + '/api/token';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(url, {'email': environment.email, 'password': environment.password}, {headers})
  }


}
