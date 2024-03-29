import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BmxService {
  webBaseUrl = 'https://tools.brandinstitute.com//wsBrandMatrix/wsBrandMatrix.asmx';
  GetProjectList = '/GetProjectList';
  GetGeneralLists = '/GetGeneralLists';
  constructor(private http: HttpClient) {}
   
  getGeneralLists() {
    return this.http.post(this.webBaseUrl + this.GetGeneralLists, {token:'646EBF52-1846-47C2-9F62-DC50AE5BF692',payload:''});
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);
    
  }
   
  getGetProjectList() {
    return this.http.post(this.webBaseUrl + this.GetProjectList, {token:'646EBF52-1846-47C2-9F62-DC50AE5BF692',payload:''});
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);
    
  }
}
