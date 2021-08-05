import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from './elite.service';

@Component({
  selector: 'app-elite',
  templateUrl: './elite.component.html',
  styleUrls: ['./elite.component.scss']
})
export class EliteComponent implements OnInit {

  declare navigator: any; 
  newVariable:any = window.navigator;
  food: any = [
    {
      name: 'BAOLI', price: 250 + 'H',
      description: 'BAOLI',
      imgSrc: './assets/img/elite/BAOILI.jpg',
      specialIntructions: '',
      selectedOption: '',
      selectedToppings: [],
      options: [
        { name: 'Green Sauce' },
        { name: 'Red Sauce' },
        { name: 'BBQ' },
        { name: 'Honey Mustard' },
      ],
      orderQuantity: 0,
      toppings: [
        { name: 'cheese', price: 0, completed: false, },
        { name: 'onions', price: 3, completed: false, },
        { name: 'mushrooms', price: 4, completed: false, },
        { name: 'Pepper', price: 3, completed: false, },
      ]
    },

    {
      name: 'CASATUA', price: 8.10,
      description: '5 passenger– Wifi – Bluetooth – High-end Sound system – Luxury Seating',
      imgSrc: './assets/img/elite/CASATUA.jpg',
      specialIntructions: '',
      selectedOption: '',
      selectedToppings: [],
      options: [
        { name: 'Green Sauce' },
        { name: 'Red Sauce' },
        { name: 'BBQ' },
        { name: 'Honey Mustard' },
      ],
      orderQuantity: 0,
      toppings: [
        { name: 'cheese', price: 3 },
        { name: 'onions', price: 3 },
        { name: 'mushrooms', price: 3 },
        { name: 'Pepper', price: 3 },
      ]
    },

    {
      name: 'TIENDITA', price: 13,
      description: '4 passenger– Wifi – Bluetooth – High-end Sound system – Luxury Seating',
      imgSrc: './assets/img/elite/TIENDITA.jpg',
      specialIntructions: '',
      selectedOption: '',
      selectedToppings: [],
      options: [
        { name: 'Green Sauce' },
        { name: 'Red Sauce' },
        { name: 'BBQ' },
        { name: 'Honey Mustard' },
      ],
      orderQuantity: 0,
      toppings: [
        { name: 'Cheese', price: 0 },
        { name: ' Chicken', price: 1.08 },
        { name: 'Steak', price: 2.16 },
        { name: 'Mixto', price: 3.24 }
      ]
    },

    {
      name: 'SBA ', price: 13,
      description: '5 passenger– Wifi – Bluetooth – High-end Sound system – Luxury Seating',
      imgSrc: './assets/img/elite/SBA.jpg',
      specialIntructions: '',
      selectedOption: '',
      selectedToppings: [],
      options: [],
      orderQuantity: 0,
      toppings: [
        { name: 'Cheese', price: 0 },
        { name: ' Chicken', price: 1.08 },
        { name: 'Steak', price: 2.16 },
        { name: 'Mixto', price: 3.24 }
      ]
    },
//  🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑 🤑
    // {
    //   name: 'Mexican Quesadilla', price: 13,
    //   description: 'Quesadilla with our fresh made guacamole, jalapenos, pico de gallo, and our chipotle aioli.',
    //   imgSrc: './assets/img/food/quesadillas.jpg',
    //   specialIntructions: '',
    //   selectedOption: '',
    //   selectedToppings: [],
    //   options: [],
    //   orderQuantity: 0,
    //   toppings: [
    //     { name: 'Cheese', price: 0 },
    //     { name: ' Chicken', price: 1.08 },
    //     { name: 'Steak', price: 2.16 },
    //     { name: 'Mixto', price: 3.24 }
    //   ]
    // },

    // {
    //   name: 'Mexican Street Tacos', price: 13,
    //   description: '2 Mouthwatering Tacos - made with CORN OR FLOUR TORTILLAS. Beef Barbacoa - Picodegallo, cilantro, cabbage & cotijacheese. ; Pollo Y Pina -Pineapple, cabbage, cilantro, Cotija cheese & Chipotle aioli.; Veggie - Fire roasted corn, mushroom, bellpeper, onions, cabbage, cilantro, guacamole, Cotija cheese & Chipotle aioli.',
    //   imgSrc: './assets/img/food/tacos.jpg',
    //   specialIntructions: '',
    //   selectedOption: '',
    //   selectedToppings: [],
    //   options: [
    //     { name: 'Corn Tortilla' },
    //     { name: 'Flour Tortilla' },
    //     { name: 'Beef Barbacoa' },
    //     { name: 'Pollo Y Pina' },
    //     { name: ' Veggie' }
    //   ],
    //   orderQuantity: 0,
    //   toppings: [
    //     { name: 'peperoni', price: 3 }
    //   ]
    // },

    // {
    //   name: 'Melissa Wings', price: 13,
    //   description: '10 Chicken Wings tossed in your choice of sauces.',
    //   imgSrc: './assets/img/food/wings.jpg',
    //   specialIntructions: '',
    //   selectedOption: '',
    //   selectedToppings: [],
    //   options: [
    //     { name: 'Buffalo' },
    //     { name: 'Spicy Asian' },
    //     { name: 'BBQ' },
    //     { name: 'Honey Mustard' },
    //   ],
    //   orderQuantity: 0,
    //   toppings: [
    //     // { name: 'peperoni', price: 3 }
    //   ]
    // },

    // {
    //   name: 'Colomboan Dog', price: 9.71,
    //   description: 'Nathan`s famous beef hot dog wrapped in applewood smoked bacon, melted Mozzarella cheese, crushed Lay`s potato chips, coleslaw, green, pink and pineapple sauce.',
    //   imgSrc: './assets/img/food/colhotdog.jpg',
    //   specialIntructions: '',
    //   selectedOption: '',
    //   selectedToppings: [],
    //   options: [],
    //   orderQuantity: 0,
    //   toppings: [
    //     // { name: 'peperoni', price: 3 }
    //   ]
    // },

    // {
    //   name: 'Venezuelan Dog', price: 9.71,
    //   description: 'Nathan`s famous beef hot dog crushed Lay`s Potato chips, coleslsaw, mayonnaise, ketchup, mustard & parmesan cheese.',
    //   imgSrc: './assets/img/food/venehotdog.jpg',
    //   specialIntructions: '',
    //   selectedOption: '',
    //   selectedToppings: [],
    //   options: [],
    //   orderQuantity: 0,
    //   toppings: [
    //     { name: 'peperoni', price: 3 }
    //   ]
    // },

    // {
    //   name: 'Mexican Dog', price: 9.71,
    //   description: 'Nathan`s famous beef hot dog, Monterey Jack Cheese, freshly-made guacamole, jalapenos and pico de gallo.',
    //   imgSrc: './assets/img/food/mexicanhotdog.jpg',
    //   specialIntructions: '',
    //   selectedOption: '',
    //   selectedToppings: [],
    //   options: [],
    //   orderQuantity: 0,
    //   toppings: [
    //     { name: 'peperoni', price: 3 }
    //   ]
    // },

    // {
    //   name: 'New Yorker', price: 9.71,
    //   description: 'Nathan`s famous beef hot dog, mustard, sauserkraut & sweet onions.',
    //   imgSrc: './assets/img/food/newyorkhotdog.jpg',
    //   specialIntructions: '',
    //   selectedOption: '',
    //   selectedToppings: [],
    //   options: [],
    //   orderQuantity: 0,
    //   toppings: [
    //     { name: 'peperoni', price: 3 }
    //   ]
    // },

  ]
 

  order = {
    tableNo: 1,   
    orderItems: [
      {
        name: 'Emapanadas', price: 8.10,
        orderQuantity: 3,
        description: 'Three Crunchy Colombian Empanadas filled with beef and potato.',
        specialIntructions: 'no ketchup',
        selectedOption: 'Cheese',
        selectedToppings: [],
      },
      {
        name: 'Colomboan Dog', price: 9.71,
        orderQuantity: 1,
        description: 'Nathan`s famous beef hot dog wrapped in applewood smoked bacon, melted Mozzarella cheese, crushed Lay`s potato chips, coleslaw, green, pink and pineapple sauce.',
        specialIntructions: '',
        selectedOption: '',
        selectedToppings: [
          { name: 'cheese', price: 0 },
          { name: 'onions', price: 3 },
          { name: 'mushrooms', price: 4 }
        ],
      },
      {
        name: 'Melissa Wings', price: 13,
        orderQuantity: 1,
        description: '10 Chicken Wings tossed in your choice of sauces.',
        specialIntructions: 'well done cooked',
        selectedOption: '',
        selectedToppings: [],
      },
    ],
    serviceCharge: 15,
    tax: 7
  }

  myAngularxQrCode = 'http://mrvrman.com/eliterecruter';
  // myAngularxQrCode = 'http://mrvrman.com/elite';

  foodOptions: any;
  foodToppings: any;

  popUpToppings = false;
  popUpOptions = false;
  popUpCheckout = false;
  popUpQRCode = false;
  popUpThankyou = false;
  popUpReview = false;
  foodTopping;
  foodOption;
  sendingOrder: any;
  selectedOption;
  paramsArray: any; email: any;
  tableNo: any;

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.tableNo = +params['id'];
    });
 // this.activatedRoute.params.subscribe(params => {
    //   this.projectName = params['id'];
    //   localStorage.setItem('projectName', this.projectName);
    //   this._NW3Service.getProjectId(this.projectName).subscribe((data: any) => {
    //     this.projectId = data[0].PresentationId;
    //     localStorage.setItem('data', data[0].PresentationId);
    //   })
    // });

    

  }


  addToCart(index) {

    this.food[index].orderQuantity = 1 + this.food[index].orderQuantity;

  }

  removeToCart(index) {
    if (this.food[index].orderQuantity > 0) {
      this.food[index].orderQuantity = this.food[index].orderQuantity - 1;
    }
  }

  option(index) {
    this.popUpOptions = true;
    this.foodOptions = this.food[index];    
  }

  crypto(){
    window.open('https://commerce.coinbase.com/checkout/d983d382-1345-4214-9518-fb7d3ca97b27', "_top");
  }

  toppings(index) {
    this.popUpToppings = true;
    this.foodToppings = this.food[index];
  }

  dismissErrorForm() {
    this.popUpToppings = false;
    this.popUpOptions = false;
    this.popUpCheckout = false;
    this.popUpQRCode = false;
  }

  reviewOrder() {
    localStorage.setItem('food', JSON.stringify(this.food));
    this.popUpCheckout = true;
    this.sendingOrder = [];
    let obj = {};
    this.food.forEach(res => {
      if (res.orderQuantity > 0) {
        let toppings = res.toppings.filter((res: any) => {
          return res.completed === true;
        })
        obj = {
          name: res.name,
          price: res.price,
          orderQuantity: res.orderQuantity,
          description: res.description,
          specialIntructions: res.specialIntructions,
          selectedOption: res.selectedOption,
          selectedToppings: toppings
        }
        this.sendingOrder.push(obj);
      }

      this.order = {
        orderItems: this.sendingOrder,
        serviceCharge: 15,
        tax: 7,
        tableNo: this.tableNo
      }



    })

    this.EliteService.sendOrder(this.order);
    localStorage.setItem('order', JSON.stringify(this.order));

  }


  checkout() {
    this.popUpCheckout = !this.popUpCheckout;
    this.popUpThankyou = true;
    this.EliteService.getOrder().subscribe(res =>{
      console.log(res);

      
    })
    this.EliteService.getStripe().subscribe(res =>{
      console.log(res);

      
    })

 
    this.EliteService.sendOrder(this.order).subscribe(res =>{
      console.log(res);
    })
  }

  qrcode() {
    let newVariable2 = (window.navigator as any)

    this.popUpQRCode = !this.popUpQRCode;
    if (newVariable2.share) {
      newVariable2.share({
        title: 'MIAMI LUXURY RIDES',
        text: 'SHARE ME',
        url: 'http://mrvrman.com/luxury-rides',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }
  confirm() {
    // this.popUpCheckout = true;

  }

  selected() {
    console.log();
  }

  thankYou() {
    this.popUpThankyou = !this.popUpThankyou;
  }

  openGoogleForm(){
    window.open('https://forms.gle/fYyxruynUuTRm62v6', "_top");
  }
}


 // food: any = [
  //   {
  //     name: 'Emapanadas', price: 8.10,
  //     description: 'Three Crunchy Colombian Empanadas filled with beef and potato.',
  //     imgSrc: './assets/img/food/empanada.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [
  //       { name: 'Green Sauce' },
  //       { name: 'Red Sauce' },
  //       { name: 'BBQ' },
  //       { name: 'Honey Mustard' },
  //     ],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'cheese', price: 0, completed: false, },
  //       { name: 'onions', price: 3, completed: false, },
  //       { name: 'mushrooms', price: 4, completed: false, },
  //       { name: 'Pepper', price: 3, completed: false, },
  //     ]
  //   },

  //   {
  //     name: 'Tequenos de Venezuala', price: 8.10,
  //     description: 'Three cheese-filled pastry fingers from Venezuela.',
  //     imgSrc: './assets/img/food/teque.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'cheese', price: 3 },
  //       { name: 'onions', price: 3 },
  //       { name: 'mushrooms', price: 3 },
  //       { name: 'Pepper', price: 3 },
  //     ]
  //   },

  //   {
  //     name: 'Maicitos', price: 13,
  //     description: 'Fireroastedcorn, topped with mozzarella cheese, crushedLay’s PotatoChips, Green sauce & Pinksauce.',
  //     imgSrc: './assets/img/food/maicitos.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'Cheese', price: 0 },
  //       { name: ' Chicken', price: 1.08 },
  //       { name: 'Steak', price: 2.16 },
  //       { name: 'Mixto', price: 3.24 }
  //     ]
  //   },

  //   {
  //     name: 'Colombian Quesadilla', price: 13,
  //     description: 'Quesadilla topped with crushed Lay’s Potato Chips, green sauce & pinksauce',
  //     imgSrc: './assets/img/food/colquesadilla.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'Cheese', price: 0 },
  //       { name: ' Chicken', price: 1.08 },
  //       { name: 'Steak', price: 2.16 },
  //       { name: 'Mixto', price: 3.24 }
  //     ]
  //   },

  //   {
  //     name: 'Mexican Quesadilla', price: 13,
  //     description: 'Quesadilla with our fresh made guacamole, jalapenos, pico de gallo, and our chipotle aioli.',
  //     imgSrc: './assets/img/food/quesadillas.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'Cheese', price: 0 },
  //       { name: ' Chicken', price: 1.08 },
  //       { name: 'Steak', price: 2.16 },
  //       { name: 'Mixto', price: 3.24 }
  //     ]
  //   },

  //   {
  //     name: 'Mexican Street Tacos', price: 13,
  //     description: '2 Mouthwatering Tacos - made with CORN OR FLOUR TORTILLAS. Beef Barbacoa - Picodegallo, cilantro, cabbage & cotijacheese. ; Pollo Y Pina -Pineapple, cabbage, cilantro, Cotija cheese & Chipotle aioli.; Veggie - Fire roasted corn, mushroom, bellpeper, onions, cabbage, cilantro, guacamole, Cotija cheese & Chipotle aioli.',
  //     imgSrc: './assets/img/food/tacos.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [
  //       { name: 'Corn Tortilla' },
  //       { name: 'Flour Tortilla' },
  //       { name: 'Beef Barbacoa' },
  //       { name: 'Pollo Y Pina' },
  //       { name: ' Veggie' }
  //     ],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'peperoni', price: 3 }
  //     ]
  //   },

  //   {
  //     name: 'Melissa Wings', price: 13,
  //     description: '10 Chicken Wings tossed in your choice of sauces.',
  //     imgSrc: './assets/img/food/wings.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [
  //       { name: 'Buffalo' },
  //       { name: 'Spicy Asian' },
  //       { name: 'BBQ' },
  //       { name: 'Honey Mustard' },
  //     ],
  //     orderQuantity: 0,
  //     toppings: [
  //       // { name: 'peperoni', price: 3 }
  //     ]
  //   },

  //   {
  //     name: 'Colomboan Dog', price: 9.71,
  //     description: 'Nathan`s famous beef hot dog wrapped in applewood smoked bacon, melted Mozzarella cheese, crushed Lay`s potato chips, coleslaw, green, pink and pineapple sauce.',
  //     imgSrc: './assets/img/food/colhotdog.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       // { name: 'peperoni', price: 3 }
  //     ]
  //   },

  //   {
  //     name: 'Venezuelan Dog', price: 9.71,
  //     description: 'Nathan`s famous beef hot dog crushed Lay`s Potato chips, coleslsaw, mayonnaise, ketchup, mustard & parmesan cheese.',
  //     imgSrc: './assets/img/food/venehotdog.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'peperoni', price: 3 }
  //     ]
  //   },

  //   {
  //     name: 'Mexican Dog', price: 9.71,
  //     description: 'Nathan`s famous beef hot dog, Monterey Jack Cheese, freshly-made guacamole, jalapenos and pico de gallo.',
  //     imgSrc: './assets/img/food/mexicanhotdog.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'peperoni', price: 3 }
  //     ]
  //   },

  //   {
  //     name: 'New Yorker', price: 9.71,
  //     description: 'Nathan`s famous beef hot dog, mustard, sauserkraut & sweet onions.',
  //     imgSrc: './assets/img/food/newyorkhotdog.jpg',
  //     specialIntructions: '',
  //     selectedOption: '',
  //     selectedToppings: [],
  //     options: [],
  //     orderQuantity: 0,
  //     toppings: [
  //       { name: 'peperoni', price: 3 }
  //     ]
  //   },

  // ]
