import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BsrService {

  conceptsOrder: any;
  webBaseUrl = 'https://tools.brandinstitute.com/BIWebServices/';
  webBaseUrlVote = 'https://tools.brandinstitute.com/wsGeneral/wsNWVote.asmx/';
  apiCall = 'api/BiFormCreator/';
  _SP_GetCandidateNames = '[BI_GUIDELINES].[dbo].[bsr_getNameCandidates] ';
  _SP_GetSlideInfo = '[BI_GUIDELINES].[dbo].[nw_SaveSlideData_Group_withRecraft] ';

  _SP_GetProjectId = '[dbo].[nw_GetPresentationId_BSRID] \'';
  _SP_comments = '[BI_GUIDELINES].[dbo].[bsr_comments] \''; 
  // 'te2381','20',N'<span style="font-style: italic;">test</span>'
  _SP_Get_Group_Summary = '[dbo].[nw_GetSummary_group] ';
  japanese: string;
  // projectId = 'te2647'
  projectId = 'te2687'
  // projectId = 'rg2327'
  // projectId = 'ca2456'
  // projectId = 'te2381'


  // urlPlusPost = '[BI_GUIDELINES].[dbo].[bsr_updConceptData] ' + "'" + localStorage.getItem('projectId') + "'";
 
  
  _SP_CHANGE_POST_IT_ORDER:any;
  _SP_NewNameBSR = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames] N'";
  _SP_NewNameNSR = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames] N'";
  _SP_NewNameNSR_v2021 = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames_v2021] N'";
  // _SP_NewNameBSR_v2021 = "[BI_GUIDELINES].[dbo].[bsr_mobAddNames_v2021] N'";
  _SP_deleteNames = "[BI_GUIDELINES].[dbo].[bsr_delName] ";
  _SP_getSynonims = "[BI_GUIDELINES].[dbo].[bsr_GetSynonyms] ";


  isNSR: any;
  projectName: any;

  constructor(private http: HttpClient) {
    this._SP_CHANGE_POST_IT_ORDER = '[BI_GUIDELINES].[dbo].[bsr_updConceptOrder] N' + "'" + JSON.stringify(this.conceptsOrder) + "'";
   }

  sendNewName(nameContainer, isNSR, conceptid?, nameid? ) {
    this.projectId = localStorage.getItem(this.projectName + '_projectId');
    let newNameContainer = {
      name: nameContainer.split(','),
      source: 'Moderator',
      userEmail: 'system@brandinstitute.com',
      conceptid: conceptid, // new stuff 
      nameid: nameid // new stuff 
    }
    let newNameObject;
    if (isNSR) {
      newNameObject = this._SP_NewNameNSR_v2021 + this.projectId + ',' + JSON.stringify(newNameContainer) + "'";
    } else {
      newNameObject = this._SP_NewNameNSR_v2021 + this.projectId + ',' + JSON.stringify(newNameContainer) + "'";
    }
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(newNameObject), httpOptions);
  }

  deleteName(nameId) {
    this.projectId = localStorage.getItem(this.projectName + '_projectId');
    let newNameObject = this._SP_deleteNames + this.projectId.replace(/\D+/g, '') + ',' + nameId;
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(newNameObject), httpOptions);
  }

  getSinonyms(sinonym) {
    let newNameObject = this._SP_getSynonims + "N" + "'"+ sinonym + "'" ;
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(newNameObject), httpOptions);
  }

  getNameCandidates(projectId) {
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_GetCandidateNames + projectId), httpOptions);

  }
  getSlides(projectId) {
    const urlPlusProjectId = '[BI_GUIDELINES].[dbo].[bsr_GetSlides] ' + "'" + projectId + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(urlPlusProjectId), httpOptions);
  }

  getPost() {
    console.log(this.projectName)
    const urlGetPosit = '[BI_GUIDELINES].[dbo].[bsr_GetProjectData] ' + "'" + localStorage.getItem(this.projectName + '_projectId') + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(urlGetPosit), httpOptions);
  }

  newPost(newConcept) {
    console.log(newConcept)
    let _SP_NewComcept = "[BI_GUIDELINES].[bsrv2].[bsr_updConcept] N'" + newConcept + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_NewComcept), httpOptions);
  }

  updatePost(updateConcept) {
    let json = JSON.parse(updateConcept);
    let newUpdateConcept = {...json, concept:json.concept.replace("'", "`")};
    let string = JSON.stringify(newUpdateConcept);
    let _SP_NewComcept = "[BI_GUIDELINES].[dbo].[bsr_updConceptData] N'" + string + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_NewComcept), httpOptions);
  }

  deletePost(conceptid) {
    this.projectId = localStorage.getItem(this.projectName + '_projectId');
    let _SP_NewComcept = "[BI_GUIDELINES].[dbo].[bsr_delConcept] '" + this.projectId + "'," + conceptid;
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_NewComcept), httpOptions);
  }

  postItOrder(projectId, conceptIdArray) {
    this.projectId = projectId;
    // this.conceptIdArray = conceptIdArray;
    let sendStrOrder = {
      projectId: projectId,
      conceptIdArray: conceptIdArray
    }
    // [BI_GUIDELINES].[dbo].[bsr_updConceptOrder] N'{"projectId":"CA2456","conceptIdArray":["7686","7685","7689","8105","8106"]}'
    let _SP_CHANGE_POST_IT_ORDER = '[BI_GUIDELINES].[dbo].[bsr_updConceptOrder] N' + "'" + JSON.stringify(sendStrOrder) + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_CHANGE_POST_IT_ORDER), httpOptions);
  }


  getProjectId(projectName) {
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_GetProjectId + projectName + '\''), httpOptions);
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);
  }

  sendComment(comment: string) {
    // [BI_GUIDELINES].[dbo].[bsr_comments] 'te2381','20',N'<span style="font-style: italic;">testdd</span>'
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_comments + comment), httpOptions);
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);
  }

  getComments(slideIndex) {
    this.projectId = localStorage.getItem(this.projectName + '_projectId');
    const _SP_getComments = "[BI_GUIDELINES].[dbo].[bsr_get_comments] ";
    // [BI_GUIDELINES].[dbo].[bsr_get_comments] 'te2381','20'
    const getCommentsParam = "'" + this.projectId + "','" + slideIndex + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_getComments + getCommentsParam ), httpOptions);
    // return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);
  }


  setProjectName(projectName) {
     this.projectName = projectName;
  }

  getProjectName() {
    return this.projectName;
  }


  //  sendNewDirectorsName (sendNewName) {
  //     var nameContainer = [];
  //     nameContainer = sendNewName.replace(/'/g, '`').split(',');
  //     if (this.isNSR) {
  //       var sendNewNameObj = JSON.stringify(new newNamesObject(nameContainer, 'Moderator', 'system@brandinstitute.com')),
  //         _SP_Saving_New_Names_Mobile = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames] N'" +
  //           _ProjectId + ',' + sendNewNameObj + "'";
  //     } else {
  //       var sendNewNameObj = JSON.stringify(new newNamesObject(nameContainer, 'Moderator', 'system@brandinstitute.com')),
  //         _SP_Saving_New_Names_Mobile = "[BI_GUIDELINES].[dbo].[bsr_mobAddNames] N'" +
  //           _ProjectId + ',' + sendNewNameObj + "'";
  //     }
  //     $http.post(webBaseUrl + apiCall, JSON.stringify(_SP_Saving_New_Names_Mobile)).
  //       success(function (data) {
  //         this.candidateNames = data;
  //       }).error(function (error) {
  //         console.log(error);
  //       });

  //     $http.post('https://tools.brandinstitute.com/webServiceNaming/wsProcessNames.asmx/prcNSR').success(function (result) {
  //       console.log(result);
  //     })
  //       .error(function (error) {
  //         console.log(error);
  //       });

  //     self.newNameFromDirector = '';
  //   };


}

