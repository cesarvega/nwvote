import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BsrService {

  private isMute = new BehaviorSubject<boolean>(false);
  currentMute = this.isMute.asObservable();
  private isnwVOTE = new BehaviorSubject<boolean>(false);
  currentNWVOTE = this.isnwVOTE.asObservable();
  japanese: string;
  actualSite =  window.location.href
  baseUrl: any;
  restUrl: any;

  changemute(mute: boolean) {
    this.isMute.next(mute);
  }
  changeNWvote(mute: boolean) {
    this.isnwVOTE.next(mute);
  }


  constructor(private http: HttpClient) {
    if(this.actualSite.includes('https://d3lyn5npnikbck.cloudfront.net') || this.actualSite.includes('http://localhost:4200/') ){
      this.baseUrl = "https://bitools.s3.amazonaws.com/nw-resources/"
    }else{
        this.baseUrl = "http://bipresents.com/nw2/"
    }
  }

  // webBaseUrl = 'http://localhost:64378/';
  webBaseUrl = 'https://tools.brandinstitute.com/BIWebServices/';
  webBaseUrlVote = 'https://tools.brandinstitute.com/wsGeneral/wsNWVote.asmx/';
  apiCall = 'api/BiFormCreator/';
  _SP_GetCandidateNames = '[BI_GUIDELINES].[dbo].[bsr_getNameCandidates_nw] \'';
  _SP_GetSlideInfo = '[BI_GUIDELINES].[dbo].[nw_SaveSlideData_Group_withRecraft] ';
  // _SP_GetSlideInfo = '[BI_GUIDELINES].[dbo].[nw_SaveSlideData_Group_withMp3] '; OLD SP
  // _SP_GetSlideInfo = '[BI_GUIDELINES].[dbo].[nw_SaveSlideData_Group] ';
  _SP_GetProjectId = '[dbo].[nw_GetPresentationId_BSRID] \'';
  _SP_Get_Group_Summary = '[dbo].[nw_GetSummary_group] ';


  // CG
  awsBaseUrl = "https://0hq9qn97gk.execute-api.us-east-1.amazonaws.com/prod-bitools01/tmx" ; 
  awsToken = "38230499-A056-4498-80CF-D63D948AA57F";
  awsResourcesUrl = "https://bitools.s3.amazonaws.com/nw-resources/"


  getProjectId(projectName) {
    //return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_GetProjectId + projectName + '\''), httpOptions);
    //// return this.http.get(this.webBaseUrl + 'api/NW_GetProjectIdWithProjectName?projectName=' + projectName, httpOptions);

  // CG
  const data = {
    token: this.awsToken
    , app : 'NW'
    , method : 'BiFormCreator'
    , project : projectName
  }
  return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
    .pipe(
      map(
        (response : string ) => {
          const data =  JSON.parse(response);
          console.log(data)
          return data;
          
        }
      )      
    )
  }

  saveNotes(projectId, notes) {
   // return this.http.post(this.webBaseUrl + 'api/NW_SaveNotes',
   //   JSON.stringify(projectId + ', N\'' + notes + '\', \'Explore\''), httpOptions);

   // CG
   const data = {
    token: this.awsToken
    , app : 'NW'
    , method : 'NW_SaveNotes'
    , projectid : projectId
    , notes : notes
    , notetype : 'Explore'
    
  }
  return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions);

  }

  getNotes(projectId) {
    // return this.http.get(this.webBaseUrl + 'api/NW_GetNotes?projectid=' + projectId, httpOptions);

// CG
const data = {
  token: this.awsToken
  , app : 'NW'
  , method : 'NW_GetNotes'
  , projectid : projectId
}
return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
  .pipe(
      map(
        (response : string ) => {
          const data =  JSON.parse(response);
          return data;
        }
      )
    )
  }

  getProjectData(projectId) {
    //return this.http.get(this.webBaseUrl + 'api/NW_NamesAndSlides?projectId=' + projectId, httpOptions);

    // CG
    const data = {
      token: '38230499-A056-4498-80CF-D63D948AA57F'
      , app : 'NW'
      , method : 'NW_NamesAndSlides'
      , projectid : projectId
    }
    return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
    .pipe(
      map(
        (response : string ) => {
          const data =  JSON.parse(response);
          return data;
        }
      )
    )
  }

  saveSlideInformation(modelToSave) {
    //return this.http.post(this.webBaseUrl + 'api/NW_SaveAndReturnSlideData', modelToSave, httpOptions);

 /* Not Used ...... */
    // CG
    const saveObj = JSON.parse(modelToSave);

    // CG
    const data = {
      token: '38230499-A056-4498-80CF-D63D948AA57F'
      , app : 'NW'
      , method : 'NW_SaveSlideData'
      , presentationid : saveObj.presentationid
      , slidenumber : saveObj.slideNumber 
      , nameranking : saveObj.NameRanking 
      , newnames : saveObj.NewNames
      , namestoexplore : saveObj.NamesToExplore
      , namestoavoid : saveObj.NamesToAvoid 
      , direction : saveObj.Direction 
      , kananamesnegative :  saveObj.KanaNamesNegative
      , recraft : saveObj.recraft

    }
    return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions);



  }

  getRetainTypeName(projectId, selectedRank) {
    /*    
        if (selectedRank === 'Negative' || selectedRank === 'New') {
          return this.http.get(this.webBaseUrl + 'api/NW_GetSummary?instruccion=' + projectId + ', "' +
            selectedRank + ' Names"', httpOptions);
        }
        return this.http.get(this.webBaseUrl + 'api/NW_GetSummary?instruccion=' + projectId + ', "' +
          selectedRank + ' Retained Names"', httpOptions);
    */     

    // CG
    var summaryType = selectedRank;

    if (selectedRank === 'Negative' || selectedRank === 'New') {
    summaryType = selectedRank + ' Names' ;
    }
    else {
    summaryType = selectedRank + ' Retained Names' ;
    }  

    const data = {
    token: '38230499-A056-4498-80CF-D63D948AA57F'
    , app : 'NW'
    , method : 'NW_GetSummary'
    , projectid : projectId
    , summarytype  : summaryType  
    }
    return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
    .pipe(
      map(
        (response : string ) => {
          const data =  JSON.parse(response);
          return data;
        }
      )
    )
  }

  getSelectedName(projectId, selectedName) {
    /*
    return this.http.get(this.webBaseUrl + 'api/NW_NamesAndSlides?projectIdAndTestName=' + projectId + ',\'' +
      encodeURIComponent(selectedName) + '\'', httpOptions);
      */
     // CG

     const data = {
      token: '38230499-A056-4498-80CF-D63D948AA57F'
      , app : 'NW'
      , method : 'NW_NamesAndSlidesProjectAndTestName'
      , presentationid : projectId
      , selectedname   : encodeURIComponent(selectedName)
    }
    return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
    .pipe(
      map(
        (response : string ) => {
          const data =  JSON.parse(response);
          return data;
        }
      )
    )
  }

  getNewNames(projectId) {
    //return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_GetCandidateNames + projectId + '\''), httpOptions);

   // CG

   const data = {
      token: '38230499-A056-4498-80CF-D63D948AA57F'
      , app : 'NW'
      , method : 'NW_GetNameCandidates'
      , presentationid : projectId

    }
    return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
    .pipe(
      map(
        (response : string ) => {
          const data =  JSON.parse(response);
          return data;
        }
      )
    )
  }

  getSaveNSlideInfo(modelToSave) {
    const regex = /Negative/gi;
    const regexapostrophe = /'/gi;
    const saveObj = JSON.parse(modelToSave);
    // console.log(saveObj.NameRanking);
    if (saveObj.NameRanking.length > 9) {
      const newNameRanking = saveObj.NameRanking.replace(regex, 'novalue');
      saveObj.NameRanking = newNameRanking;
    }

    this.japanese = localStorage.getItem('isKatakana');

    if (saveObj.NamesToExplore !== '') {
      saveObj.NamesToExplore = this.convertToEntities(saveObj.NamesToExplore);
    }
    if (saveObj.NewNames !== '') {
      saveObj.NewNames = this.convertToEntities(saveObj.NewNames);
    }
    if (saveObj.KanaNamesNegative !== '') {
      saveObj.KanaNamesNegative = this.convertToEntities(saveObj.KanaNamesNegative);
    }
    saveObj.NamesToExplore = saveObj.NamesToExplore.replace(regexapostrophe, '\'\'');
    saveObj.NewNames = saveObj.NewNames.replace(regexapostrophe, '\'\'');
    const params = saveObj.presentationid + ',' + saveObj.slideNumber + ',\'' +
      saveObj.NameRanking + '\',\'' + saveObj.NewNames + '\',\'' + saveObj.NamesToExplore + '\',\'' +
      saveObj.NamesToAvoid + '\',\'' + saveObj.Direction + '\',\'' +
      saveObj.KanaNamesNegative + '\',' + saveObj.recraft;
    //return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_GetSlideInfo + params), httpOptions);

    // CG
    const data = {
      token: '38230499-A056-4498-80CF-D63D948AA57F'
      , app : 'NW'
      , method : 'NW_SaveSlideData'
      , presentationid : saveObj.presentationid
      , slidenumber : saveObj.slideNumber 
      , nameranking : saveObj.NameRanking 
      , newnames : saveObj.NewNames
      , namestoexplore : saveObj.NamesToExplore
      , namestoavoid : saveObj.NamesToAvoid 
      , direction : saveObj.Direction 
      , kananamesnegative :  saveObj.KanaNamesNegative
      , recraft : saveObj.recraft

    }
    return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
    .pipe(
      map(
        (response : string ) => {
          const data =  JSON.parse(response);
          return data;
        }
      )
    )
  }

  getGroupSummary(projectId) {
    //return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_Get_Group_Summary + projectId), httpOptions);

    // CG

    const data = {
      token: '38230499-A056-4498-80CF-D63D948AA57F'
      , app : 'NW'
      , method : 'NW_GetSummaryGroup'
      , presentationid : projectId

    }
    //return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions);
    return this.http.post(this.awsBaseUrl , JSON.stringify(data), httpOptions)
    .pipe(
        map(
          (response : string ) => {
            const data =  JSON.parse(response);
            return data;
          }
      )
    )
  }

  sendNameToNwVote(name) {

    //return this.http.post(this.webBaseUrl + this.apiCall, { name: name });

        /* Not Used */
    // CG
    return  this.getProjectId(name) 

  }

  convertToEntities(str) {
    // if (str.length !== 0) {
    if (str.length !== 0 && (this.japanese === 'true') ? true : false) {
      const tstr = str.trim();
      let bstr = '';
      for (let i = 0; i < tstr.length; i++) {
        bstr += '&#' + tstr.charCodeAt(i) + ';';
      }
      return bstr;
    } else {
      return str;
    }
  }


  sendGoSignalVoting(project, go): any {
    const data = {
      token:
        '38230499-A056-4498-80CF-D63D948AA57F',
      project:
        project,
      isOn:
        (go) ? 1 : 0
    }
    return this.http.post(this.webBaseUrlVote + 'SwitchProjectStatus', JSON.stringify(data), httpOptions);

  }

  getNwVoteData(project, name): any {
    const data = {
      token:
        '38230499-A056-4498-80CF-D63D948AA57F',
      project:
        project,
      name:
        name
    }
    return this.http.post(this.webBaseUrlVote + 'UserListVote', JSON.stringify(data), httpOptions);
  }

  ResetProjectData(project): any {
    const data = {
      token:
        '38230499-A056-4498-80CF-D63D948AA57F',
      project:
        project,
    }
    return this.http.post(this.webBaseUrlVote + 'ResetProjectData', JSON.stringify(data), httpOptions);
  }

  DeleteUserFromProject(project, name): any {
    const data = {
      token:
        '38230499-A056-4498-80CF-D63D948AA57F',
      project:
        project,
      username:
        name,
      userToken:
        ""
    }
    return this.http.post(this.webBaseUrlVote + 'DeleteUserFromProject', JSON.stringify(data), httpOptions);
  }


  getBaseUrlForResources(): string {
    return this.baseUrl;
  }
}
