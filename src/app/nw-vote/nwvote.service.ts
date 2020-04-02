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
    presentationid:
      '2',
    username:
      'cvega',
    userToken:
      '8B4C5800-37A7-4D27-AE02-430402F2ECE2'

  }
  dataVote = {
    token:
      '38230499-A056-4498-80CF-D63D948AA57F',
    presentationid:
      '2',
    username:
      'cvega',
    userToken:
      '8B4C5800-37A7-4D27-AE02-430402F2ECE2',
    name:
      '',
    vote:
      ''
  }

  getName() {
    return this.http.post(this.webBaseUrl + 'GetVotingInfo', this.data);
  }

  voteName(vote: string, name: string) {
    this.dataVote.name = name;
    this.dataVote.vote = vote;
    return this.http.post(this.webBaseUrl + this.apiCall, this.dataVote);
  }
}
