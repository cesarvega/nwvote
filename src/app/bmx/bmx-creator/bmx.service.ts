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
  brandMatrixSave = '/BrandMatrixSave';
  GetParticipantList = '/BrandMatrixGetParticipantList'
  GetProjectInfo = '/BrandMatrixGetDirectorList';
  SaveProjectInfor = '/BrandMatrixUpdDirectorList'
  BrandMatrixResourceUpload = '/BrandMatrixResourceUpload'
  constructor(private http: HttpClient) { }

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

  saveFileResources(resourceData: any) {
    return this.http.post(this.webBaseUrl + this.BrandMatrixResourceUpload, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: resourceData });
  }


  saveOrUpdateProjectInfo(project, data) { }

  // save template string

  saveOrUpdateTemplate(bmxCompleteObject) {

    const searchRegExp = new RegExp("'", 'g');
   
    const payloadString =  JSON.stringify({
      "ProjectName": "TEST",
      "BrandMatrix": JSON.stringify(bmxCompleteObject).replace(searchRegExp, '`')
    })
    return this.http.post(this.webBaseUrl + this.brandMatrixSave, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: payloadString
    });
  }

  saveOrUpdateAnswers(bmxCompleteObject) {

    var encoded = JSON.stringify(bmxCompleteObject)
    let variable = { name: 'test', project: 'test' }
    let quote = "'" + variable + "'"
    return this.http.post(this.webBaseUrl + this.brandMatrixSave, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: {
        "ProjectName": "TEST",
        "UserName": "cesar"
        , "BrandMatrix": "'" + variable + "'"
      }
    });
  }

  // Default templates to design the project from
  getTemplates(project) { }

  // Current Template being used for this project
  getProjectTemplate(project) { }

}
