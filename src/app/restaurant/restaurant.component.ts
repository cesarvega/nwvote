import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {

  food = [
    {
      name: 'Emapanadas', price: 8.10,
      description: 'Three Crunchy Colombian Empanadas filled with beef and potato.',
      options: [],
      orderQuantity: 0,
      toppings: [
        // {name:'', price: 3}
      ]
    },

    {
      name: 'Tequenos de Venezuala', price: 8.10,
      description: 'Three cheese-filled pastry fingers from Venezuela.',
      options: [],
      orderQuantity: 0,
      toppings: [
        // {name:'cheese', price: 3}
      ]
    },

    {
      name: 'Maicitos', price: 13,
      description: 'Fireroastedcorn, topped with mozzarella cheese, crushedLay’s PotatoChips, Green sauce & Pinksauce.',
      options: [],
      orderQuantity: 0,
      toppings: [
        { name: 'Cheese', price: 0 },
        { name: ' Chicken', price: 1.08 },
        { name: 'Steak', price: 2.16 },
        { name: 'Mixto', price: 3.24 }
      ]
    },

    {
      name: 'Colombian Quesadilla', price: 13,
      description: 'Quesadilla topped with crushed Lay’s Potato Chips, green sauce & pinksauce',
      options: [],
      orderQuantity: 0,
      toppings: [
        { name: 'Cheese', price: 0 },
        { name: ' Chicken', price: 1.08 },
        { name: 'Steak', price: 2.16 },
        { name: 'Mixto', price: 3.24 }
      ]
    },

    {
      name: 'Mexican Quesadilla', price: 13,
      description: 'Quesadilla with our fresh made guacamole, jalapenos, pico de gallo, and our chipotle aioli.',
      options: [],
      orderQuantity: 0,
      toppings: [
        { name: 'Cheese', price: 0 },
        { name: ' Chicken', price: 1.08 },
        { name: 'Steak', price: 2.16 },
        { name: 'Mixto', price: 3.24 }
      ]
    },

    {
      name: 'Mexican Street Tacos', price: 13,
      description: '2 Mouthwatering Tacos - made with CORN OR FLOUR TORTILLAS. Beef Barbacoa - Picodegallo, cilantro, cabbage & cotijacheese. ; Pollo Y Pina -Pineapple, cabbage, cilantro, Cotija cheese & Chipotle aioli.; Veggie - Fire roasted corn, mushroom, bellpeper, onions, cabbage, cilantro, guacamole, Cotija cheese & Chipotle aioli.',
      options: [
        { name: 'Corn Tortilla' },
        { name: 'Flour Tortilla' },
        { name: 'Beef Barbacoa' },
        { name: 'Pollo Y Pina' },
        { name: ' Veggie' }
      ],
      orderQuantity: 0,
      toppings: [
        { name: 'peperoni', price: 3 }
      ]
    },

    {
      name: 'Melissa Wings', price: 13,
      description: '10 Chicken Wings tossed in your choice of sauces.',
      options: [
        { name: 'Buffalo' },
        { name: 'Spicy Asian' },
        { name: 'BBQ' },
        { name: 'Honey Mustard' },
      ],
      orderQuantity: 0,
      toppings: [
        // { name: 'peperoni', price: 3 }
      ]
    },

    {
      name: 'Colomboan Dog', price: 9.71,
      description: 'Nathan`s famous beef hot dog wrapped in applewood smoked bacon, melted Mozzarella cheese, crushed Lay`s potato chips, coleslaw, green, pink and pineapple sauce.',
      options: [],
      orderQuantity: 0,
      toppings: [
        // { name: 'peperoni', price: 3 }
      ]
    },

    {
      name: 'Venezuelan Dog', price: 9.71,
      description: 'Nathan`s famous beef hot dog crushed Lay`s Potato chips, coleslsaw, mayonnaise, ketchup, mustard & parmesan cheese.',
      options: [],
      orderQuantity: 0,
      toppings: [
        { name: 'peperoni', price: 3 }
      ]
    },

    {
      name: 'Mexican Dog', price: 9.71,
      description: 'Nathan`s famous beef hot dog, Monterey Jack Cheese, freshly-made guacamole, jalapenos and pico de gallo.',
      options: [],
      orderQuantity: 0,
      toppings: [
        { name: 'peperoni', price: 3 }
      ]
    },

    {
      name: 'New Yorker', price: 9.71,
      description: 'Nathan`s famous beef hot dog, mustard, sauserkraut & sweet onions.',
      options: [],
      orderQuantity: 0,
      toppings: [
        { name: 'peperoni', price: 3 }
      ]
    },

  ]

  foodOptions: any;
  foodToppings: any;

  popUpToppings = false;
  popUpOptions = false;
  popUpCheckout = false;
  popUpReview = false;
  foodTopping;
  foodOption;

  constructor() { }

  ngOnInit(): void {
  }


  addToCart(index) {

    this.food[index].orderQuantity = 1 + this.food[index].orderQuantity; 

  }

  removeToCart(index) {
    if (this.food[index].orderQuantity > 0) {      
      this.food[index].orderQuantity = this.food[index].orderQuantity - 1  ; 
    }
  }

  option(index) {
    this.popUpOptions = true;
    this.foodOptions = this.food[index];
  }

  toppings(index) {
    this.popUpToppings = true;
    this.foodToppings = this.food[index];
  }

  dismissErrorForm() {
    this.popUpToppings = false;
    this.popUpOptions = false;
    this.popUpCheckout = false;
  }

  

  checkout() {
    this.popUpCheckout = true;
    
  }

  // toppingsSlected() {
  //   this.popUpCheckout = true;
    
  // }


}
