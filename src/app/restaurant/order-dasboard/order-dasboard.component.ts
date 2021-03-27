import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-order-dasboard',
  templateUrl: './order-dasboard.component.html',
  styleUrls: ['./order-dasboard.component.scss']
})
export class OrderDasboardComponent implements OnInit {
  order;
  constructor(private restaurantService :RestaurantService) { }

  ngOnInit(): void {
  this.order = this.restaurantService.getOrder()
  }



}
