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
      'cvega',
    userToken:
      ''

  }
  dataVote = {
    token:
      '38230499-A056-4498-80CF-D63D948AA57F',
    project:
      '2',
    username:
      'cvega',
    userToken:
      localStorage.getItem('userTokenId'),
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
      'cev',
    password:
      'ddd',
    summarize:
      ''
  }

  getName() {
    this.data.project = localStorage.getItem('project');
    this.data.username = localStorage.getItem('username');
    this.data.userToken = localStorage.getItem('userTokenId');
    return this.http.post(this.webBaseUrl + 'GetVotingInfo', this.data);
  }

  voteName(vote: string, name: string) {
    this.dataVote.name = name;
    this.dataVote.vote = vote;
    this.dataVote.project = localStorage.getItem('project');;
    return this.http.post(this.webBaseUrl + 'SaveVotingInfo', this.dataVote);
  }

  login(data: any, project: string) {
    this.dataLogin.username = data.email;
    this.dataLogin.password = data.name;
    this.dataLogin.project = project;    
    this.dataLogin.summarize = (data.suma)?'1':'0';
    return this.http.post(this.webBaseUrl + 'AuthorizeUser', this.dataLogin);
  }
}
