import {inject, Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Error} from "../+models/error";

@Injectable({
  providedIn: 'root'
})
export class AwsLogsServices {


  constructor(private http: HttpClient) {
  }

  log(error: Error) {
    const url = environment.isgAwsLogs + '/isg/logs';


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(url, error, {headers});
  }
}
