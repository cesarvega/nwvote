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
  projectId = 'RG2327'
  // projectId = 'ca2456'
  // projectId = 'te2381'
  // BI-FULL-SYS
  //   conceptConstructor() {
  //     this.projectId = _ProjectId;
  //     this.conceptid = '0';
  //     this.concept = 'Concept';
  //     this.conceptorder = '0';
  //     this.attributes = [];
  //     this.names = [];
  // }[BI_GUIDELINES].[dbo].[bsr_updConceptData]

  urlPlusPost = '[BI_GUIDELINES].[dbo].[bsr_updConceptData] ' + "'" + this.projectId + "'";
  urlPlusProjectId = '[BI_GUIDELINES].[dbo].[bsr_GetSlides] ' + "'" + this.projectId + "'";
  urlGetPosit = '[BI_GUIDELINES].[dbo].[bsr_GetProjectData] ' + "'" + this.projectId + "'";
  _SP_CHANGE_POST_IT_ORDER = '[BI_GUIDELINES].[dbo].[bsr_updConceptOrder] N' + "'" + JSON.stringify(this.conceptsOrder) + "'";
  _SP_NewName = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames] N'";
  isNSR: any;
 
  constructor(private http: HttpClient) { }

  sendNewName(nameContainer) {
    let newNameContainer = {
      name: nameContainer.split(','),
      source: 'Moderator',
      userEmail: 'system@brandinstitute.com',
    }
    let newNameObject = this._SP_NewName + this.projectId + ',' + JSON.stringify(newNameContainer) + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(newNameObject), httpOptions);
  }

  getNameCandidates(projectId) {
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_GetCandidateNames + projectId), httpOptions);

  }
  getSlides(projectId) {
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this.urlPlusProjectId), httpOptions);
  }

  getPost(projectName) {
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this.urlGetPosit), httpOptions);
  }

  newPost(newConcept) {
    let _SP_NewComcept = "[BI_GUIDELINES].[dbo].[bsr_updConcept] N'" + newConcept + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_NewComcept), httpOptions);
  }

  deletePost(conceptid) {
    let _SP_NewComcept = "[BI_GUIDELINES].[dbo].[bsr_delConcept] '" + this.projectId + "'," + conceptid;
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(_SP_NewComcept), httpOptions);
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

