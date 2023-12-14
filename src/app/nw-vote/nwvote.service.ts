import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NwvoteService {

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
  dataVote = {
    token:
      '38230499-A056-4498-80CF-D63D948AA57F',
    project:
      '2',
    username:
      '',
    userToken:
     '',
    name:
      '',
    vote:
      ''
  }
  dataLogin = {
    token:
      '38230499-A056-4498-80CF-D63D948AA57F',
    project:
      '2',
    username:
      '',
    name:
      '',
    summarize:
      ''
  }

  getName() {
    this.data.project = localStorage.getItem('project');
    this.data.username = localStorage.getItem('username');
    this.data.userToken = localStorage.getItem('userTokenId');
    return this.http.post(this.webBaseUrl + 'GetVotingInfo', this.data);
  }

  voteName(name: string, vote: string) {
    this.dataVote.name = name;
    this.dataVote.vote = vote;
    this.dataVote.username = localStorage.getItem('username');
    this.dataVote.project = localStorage.getItem('project');
    this.dataVote.userToken =  localStorage.getItem('userTokenId');
    return this.http.post(this.webBaseUrl + 'SaveVotingInfo', this.dataVote);
  }

  login(data: any, project: string) {
    this.dataLogin.username = data.email;
    this.dataLogin.name = data.name;
    this.dataLogin.project = project;
    this.dataLogin.summarize = (data.suma)?'1':'0';
    console.log(this.data.token, this.dataLogin)
    return this.http.post(this.webBaseUrl + 'AuthorizeUser', this.dataLogin);
  }
}
