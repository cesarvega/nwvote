import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  order:any
  constructor() { }


  setOrder(order){
    this.order = order;
 
  }
  getOrder(){
    if (this.order) {
      
      return this.order;
    }else {
      return JSON.parse( localStorage.getItem('order'));
    }
  }


}
