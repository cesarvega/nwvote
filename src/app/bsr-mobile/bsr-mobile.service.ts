import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BsrMobileService {
  constructor(private http: HttpClient) { }

  // webBaseUrl = 'http://localhost:64378/';
  webBaseUrl = 'https://tools.brandinstitute.com/wsGeneral/wsNWVote.asmx/';
  apiCall = 'GetVotingInfo';


  data = {
    token:
      '38230499-A056-4498-80CF-D63D948AA57F',
    project:
      '2',
    username:
      '',
    userToken:
      ''
  }

  // goToLogout() {


  //   var queryData = "[BI_GUIDELINES].[dbo].[bsr_AddEmailResultsRequest] '" +
  //     setUpInfoService.getProjectId() + "'," + "'" + setUpInfoService.getUserEmail() + "'" +
  //     ",'" + setUpInfoService.getUserName() + "'";


  //   $http.post(this.webBaseUrl + this.apicall, JSON.stringify(queryData)).success(function (results) { });
  //   var broadCastLayoutChange = 'changeToLogout';
  //   setUpInfoService.setCreatePage(true);
  //   setUpInfoService.setThankYouPage(false);
  //   $rootScope.$broadcast(broadCastLayoutChange);
  // }

  // sendData (candidateName, privateOrPublic) {
  //   if (privateOrPublic === true || privateOrPublic === 'private') {
  //     userNameToSend = 'Anonymous';
  //   } else {
  //     userNameToSend = setUpInfoService.getUserName();
  //   }

  //   var newName = candidateName.replace(/'/g, '`'),
  //     oldValue = '',
  //     _SP_Saving_New_Names_Mobile = '',
  //     sendNewNamesObj = JSON.stringify(new newNamesObject(newName, oldValue, userNameToSend, setUpInfoService.getUserEmail()));
  //   if (setUpInfoService.getProjectType().toLowerCase() === 'nsr' || setUpInfoService.getProjectType().toLowerCase() === 'nsr-japan') {
  //     _SP_Saving_New_Names_Mobile = "[BI_GUIDELINES].[dbo].[nsr_mobAddNames] N'" + _ProjectId + ',' + sendNewNamesObj + "'";
  //   } else {
  //     _SP_Saving_New_Names_Mobile = "[BI_GUIDELINES].[dbo].[bsr_mobAddNames] N'" + _ProjectId + ',' + sendNewNamesObj + "'";
  //   }

  //   $http.post(webBaseUrl + apicall, JSON.stringify(_SP_Saving_New_Names_Mobile)).success(function (data) {
  //     // JSON.parse('[' + data[0].names + ']').map(function(obj, index) {
  //     //     if(vm.displayNames.indexOf(obj.name) <0){
  //     //         vm.displayNames.push(obj.name);
  //     //     }
  //     // });

  //     source.localdata = JSON.parse('[' + data[0].names + ']');
  //     $('#jqxgrid').jqxGrid('updatebounddata');
  //   });

  //   vm.newName = '';
  // }

}
