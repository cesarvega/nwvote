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
  GetParticipantList = '/BrandMatrixGetParticipantList'
  GetProjectInfo = '/BrandMatrixGetDirectorList';
  SaveProjectInfor = '/BrandMatrixUpdDirectorList'
  BrandMatrixResourceUpload = '/BrandMatrixResourceUpload'
  SendEmail = '/BrandMatrixSendEmail'
  constructor(private http: HttpClient) {}
   
  getGeneralLists() {
    return this.http.post(this.webBaseUrl + this.GetGeneralLists, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: '' });
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);

  }

  getGetProjectList() {
    return this.http.post(this.webBaseUrl + this.GetProjectList, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: '' });
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);

  }

  BrandMatrixGetParticipantList(projectName: any) {
    return this.http.post(this.webBaseUrl + this.GetParticipantList, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: '{ "ProjectName" : "' + projectName + '" }' });
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);

  }

  

  // PROJECT INFORMATON
  getProjectInfo(projectName: any) {
    return this.http.post(this.webBaseUrl + this.GetProjectInfo, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: '{ "ProjectName" : "' + projectName + '" }' });
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);
  }

  saveFileResources(resourceData: any)
  {
    return this.http.post(this.webBaseUrl + this.BrandMatrixResourceUpload, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload:  resourceData });
  }

  sendEmail(resourceData: any)
  {
    return this.http.post(this.webBaseUrl + this.SendEmail, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload:  '{ "emailData" : "' + resourceData + '" }'});

  }


  saveOrUpdateProjectInfo(project, data) {​ }​

  // save template string
  saveOrUpdateTemplate(project, template) {​ }​

// Default templates to design the project from
  getTemplates(project) {​ }​

// Current Template being used for this project
  getProjectTemplate(project) {​ }​

}
