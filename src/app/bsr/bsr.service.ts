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
  _SP_Get_Group_Summary = '[dbo].[nw_GetSummary_group] ';
  japanese: string;
  // projectId = 'te2647'
  projectId = 'rg2327'
  // projectId = 'ca2456'
  // projectId = 'te2381'


  urlPlusPost = '[BI_GUIDELINES].[dbo].[bsr_updConceptData] ' + "'" + this.projectId + "'";
  urlPlusProjectId = '[BI_GUIDELINES].[dbo].[bsr_GetSlides] ' + "'" + this.projectId + "'";
  urlGetPosit = '[BI_GUIDELINES].[dbo].[bsr_GetProjectData] ' + "'" + this.projectId + "'";
  _SP_CHANGE_POST_IT_ORDER = '[BI_GUIDELINES].[dbo].[bsr_updConceptOrder] N' + "'" + JSON.stringify(this.conceptsOrder) + "'";
  _SP_NewNameNSR = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames] N'";
  _SP_NewNameBSR = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames] N'";
  _SP_deleteNames = "[BI_GUIDELINES].[dbo].[bsr_delName] ";
  _SP_getSynonims = "[BI_GUIDELINES].[dbo].[bsr_GetSynonyms] ";

  isNSR: any;

  constructor(private http: HttpClient) { }

  sendNewName(nameContainer, isNSR) {
    let newNameContainer = {
      name: nameContainer.split(','),
      source: 'Moderator',
      userEmail: 'system@brandinstitute.com',
    }
    let newNameObject;
    if (isNSR) {
      newNameObject = this._SP_NewNameNSR + this.projectId + ',' + JSON.stringify(newNameContainer) + "'";
    } else {
      newNameObject = this._SP_NewNameBSR + this.projectId + ',' + JSON.stringify(newNameContainer) + "'";
    }
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(newNameObject), httpOptions);
  }

  deleteName(nameId) {
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
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this.urlPlusProjectId), httpOptions);
  }

  getPost() {
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this.urlGetPosit), httpOptions);
  }

  newPost(newConcept) {
    let _SP_NewComcept = "[BI_GUIDELINES].[dbo].[bsr_updConcept] N'" + newConcept + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_NewComcept), httpOptions);
  }

  updatePost(updateConcept) {
    let _SP_NewComcept = "[BI_GUIDELINES].[dbo].[bsr_updConceptData] N'" + updateConcept + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_NewComcept), httpOptions);
  }

  deletePost(conceptid) {
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

