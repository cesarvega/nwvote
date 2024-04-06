import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DeviceDetectorService } from 'ngx-device-detector';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class BsrMobileService {

  _SP_GetCreatedNamesByEmail: any;
  _SP_getProjectData: any;
  _SP_Saving_New_Names_Mobile: any;
  name: any;
  email: any;
  projectId: any;
  deviceInfo: any;
  sendNewNamesObj: { name: string; oldName: string; rationale: any; favourite: any; source: any; userEmail: any; };
  _deviceUserData: string;
  constructor(private http: HttpClient, private deviceService: DeviceDetectorService,) {


    // OS info
    this.deviceInfo = this.deviceService.getDeviceInfo();
    // const isMobile = this.deviceService.isMobile();
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.

  }

  // webBaseUrl = 'http://localhost:64378/';
  apiCall = 'api/BiFormCreator/';
  webBaseUrl = 'https://tools.brandinstitute.com/BIWebServices/';
  // webBaseUrl = 'http://localhost:64378/';



  login(data: any, projectId: string) {
    this.name = data.name;
    this.email = data.email;
    // this.email = 'cesarvega.col@gmail.com';
    this.projectId = projectId;
    this._SP_GetCreatedNamesByEmail = '[BI_GUIDELINES].[dbo].[bsr_getNameCandidatesByUser] ' + "'" + projectId + "'," + "'" + data.email + "'";

    let summa = (localStorage.getItem('summarized') === 'false') ? false : true;

    this._deviceUserData = "[BI_GUIDELINES].[dbo].[bsr_DeviceUserData] " + "'" + this.projectId + "," + this.name + "," + this.email + "," + summa + "," + 
    JSON.stringify(this.deviceInfo) + "'";


    this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._deviceUserData), httpOptions).subscribe(res => {

    });

    // this.dataLogin.summarize = (data.suma) ? '1' : '0';
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_GetCreatedNamesByEmail), httpOptions);
  }

  getProjectData(projectId) {
    this._SP_getProjectData = '[BI_GUIDELINES].[dbo].[bsr_GetProjectData] ' + "'" + projectId + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_getProjectData), httpOptions);
  }


  sendName(newName: string, OldName: string, rationale: string, favourite: string, source: string) {
    this.projectId = localStorage.getItem('projectId');
    if (source === 'Anonymous') {
      this.sendNewNamesObj = {
        name: newName,
        oldName: OldName,
        rationale: rationale,
        favourite: favourite,
        source: 'Anonymous',
        userEmail: this.email
      }
    } else {
      this.sendNewNamesObj = {
        name: newName,
        oldName: OldName,
        rationale: rationale,
        favourite: favourite,
        source: this.name,
        userEmail: this.email
      }
    }

    this._SP_Saving_New_Names_Mobile = "[BI_GUIDELINES].[bsrv2].[bsr_mobAddNames] N'" + this.projectId + ',' + JSON.stringify(this.sendNewNamesObj) + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(this._SP_Saving_New_Names_Mobile), httpOptions);
  }

  deleteName(NameId) {
    this.projectId = localStorage.getItem('projectId');
    let deleteNames = "[BI_GUIDELINES].[dbo].[bsr_delName] " + this.projectId.replace(/\D+/g, '') + "," + NameId;
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(deleteNames), httpOptions);
  }

  goToLogout() {
    this.projectId = localStorage.getItem('projectId');
    const sendEmail = "[BI_GUIDELINES].[dbo].[bsr_AddEmailResultsRequest] '" + this.projectId + "','" + this.email + "','" + this.name + "'";
    return this.http.post(this.webBaseUrl + this.apiCall, JSON.stringify(sendEmail), httpOptions);
  }


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
