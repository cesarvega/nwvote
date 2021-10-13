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

  BrandMatrixResourceUpload = '/BrandMatrixResourceUpload'// SAVES FILES TO THE SERVER IN BASE64 AND RETURS A FILE PATH
  searchGraveAccentRegExp = new RegExp("`", 'g');
  searchApostropheRegExp = new RegExp("'", 'g');


  brandMatrixSave = '/BrandMatrixSave'; // SAVES THE BRANDMATRIX PER PROJECT 
  brandMatrixSaveUserAnswers = '/BrandMatrixSaveUserAnswers'; // SAVES THE BRANDMATRIX USER ANSWERS

  
  brandMatrixGetALLUserAnswers = '/BrandMatrixGetALLUserAnswers'; // GETS THE BRANDMATRIX ANSWERS
  brandMatrixGetUserAnswers = '/BrandMatrixGetUserAnswers'; // GETS THE BRANDMATRIX SINGLE USER ANSWERS
  brandMatrixGet = '/BrandMatrixGet'; // GETS THE BRANDMATRIX BY PROJECT

  brandMatrixTemplateSave = '/BrandMatrixTemplateSave'
  brandMatrixTemplateGet = '/BrandMatrixTemplateGet'
  brandMatrixTemplateDelete = '/BrandMatrixTemplateDelete'

  GetParticipantList = '/BrandMatrixGetParticipantList';
  SaveParticipantList = '/BrandMatrixAddParticipantList';
  DelParticipantList = '/BrandMatrixDelParticipantList';
  UptParticipantList = '/BrandMatrixUpdParticipantList';

  GetProjectInfo = '/BrandMatrixProjectInfoGet';
  SaveProjectInfo = '/BrandMatrixProjectInfoSave';
  
  SaveProjectInfor = '/BrandMatrixUpdDirectorList'
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

  BrandMatrixDelParticipantList(projectName: any, partList: any) {
    var input = JSON.stringify({ "ProjectName":projectName, "ParticipantList":partList});
    return this.http.post(this.webBaseUrl + this.DelParticipantList, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: input });
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);

  }

  BrandMatrixUptParticipantList(projectName: any, partList: any) {
    var input = JSON.stringify({ "ProjectName":projectName, "ParticipantList":partList});
    return this.http.post(this.webBaseUrl + this.UptParticipantList, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: input });
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);

  }

  BrandMatrixSaveParticipantList(projectName: any, partList: any) {
    var input = JSON.stringify({ "ProjectName":projectName, "ParticipantList":partList});
    return this.http.post(this.webBaseUrl + this.SaveParticipantList, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: input });
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);

  }

  saveProjectInfo(projectName: any, projectData: any, user: any) {
    var input = JSON.stringify({ "ProjectName":projectName, "ProjectInfo":projectData, "Username":user});
    return this.http.post(this.webBaseUrl + this.SaveProjectInfo, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: input});
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

  sendEmail(resourceData: any)
  {
    return this.http.post(this.webBaseUrl + this.SendEmail, { token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: resourceData });

  }




  saveOrUpdateBMXInfo(project, data) { }

  getBrandMatrixByProject(projectName) {
    return this.http.post(this.webBaseUrl + this.brandMatrixGet, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: JSON.stringify({"ProjectName": projectName})
    })
   }


  getBrandMatrixByProjectAndUserAnswers(projectName, username) {
    return this.http.post(this.webBaseUrl + this.brandMatrixGetUserAnswers, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: JSON.stringify({"ProjectName": projectName ,"UserName": username })
    })
   }

  // save template string

  saveOrUpdateBradnMatrixTemplate(bmxCompleteObject,projectName) {
    const payloadString = JSON.stringify({
      ProjectName: projectName,
      BrandMatrix: JSON.stringify(bmxCompleteObject).replace(this.searchApostropheRegExp, '`')
    })
    return this.http.post(this.webBaseUrl + this.brandMatrixSave, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: payloadString
    })
  }

  saveOrUpdateAnswers(bmxCompleteObject,projectName, username) {
    const payloadString = JSON.stringify({
      ProjectName: projectName,
      UserName: username,
      BrandMatrix: JSON.stringify(bmxCompleteObject).replace(this.searchApostropheRegExp, '`')
    })
    return this.http.post(this.webBaseUrl + this.brandMatrixSaveUserAnswers, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: payloadString
    })
  }

  // Default templates for all BMX

  getBrandMatrixTemplateByName(templateName) {
    const payloadString = JSON.stringify({
      TemplateName: templateName,
    })
    return this.http.post(this.webBaseUrl + this.brandMatrixTemplateGet, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: payloadString
    })
   }

  deleteBrandMatrixTemplateByName(templateName) {
    const payloadString = JSON.stringify({
      TemplateName: templateName,
    })
    return this.http.post(this.webBaseUrl + this.brandMatrixTemplateDelete, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: payloadString
    })
   }

  saveBrandMatrixTemplate(templateName, templateObj, username) { 
    const payloadString = JSON.stringify({
      TemplateName: templateName,
      Username: username,
      BrandMatrix: JSON.stringify(templateObj).replace(this.searchApostropheRegExp, '`')
    })
    return this.http.post(this.webBaseUrl + this.brandMatrixTemplateSave, {
      token: '646EBF52-1846-47C2-9F62-DC50AE5BF692', payload: payloadString
    })
  }

}
