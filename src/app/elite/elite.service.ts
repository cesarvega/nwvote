import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EliteService {

  order: any
  constructor(private http: HttpClient) { }


  sendOrder(order) {
    this.order = JSON.stringify(order);
    return this.http.post('https://blooming-island-37744.herokuapp.com/order', this.order, httpOptions);
  }


  getOrder() {    
    return this.http.get('https://blooming-island-37744.herokuapp.com/order');
  }


  getStripe() {    
    return this.http.get('https://blooming-island-37744.herokuapp.com/payment/session?amount=100&id=100');
  }

}
