import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
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
  newVariable: any = window.navigator;
  food: any = [
    {
      name: 'Cesar Vega',
      description: 'Recruiter',
      imgSrc: './assets/img/elite/CesarVega/CesarRecruiter.png',
    },
    // {
    //   name: 'Instagram',
    //   description: 'Instagram',
    //   imgSrc: './assets/img/elite/CesarVega/Instagram.png',
    // },
    // {
    //   name: 'FaceBook',
    //   description: 'FaceBook',
    //   imgSrc: './assets/img/elite/CesarVega/FaceBook.png',
    // },
    // {
    //   name: 'LinkIn',
    //   description: 'LinkIn',
    //   imgSrc: './assets/img/elite/CesarVega/LinkIn.png',
    // },
    // {
    //   name: 'Tweeter',
    //   description: 'Tweeter',
    //   imgSrc: './assets/img/elite/CesarVega/Tweeter.png',
    // },
    // {
    //   name: 'SnapChat',
    //   description: 'SnapChat',
    //   imgSrc: './assets/img/elite/CesarVega/SnapChat.png',
    // },
    // {
    //   name: 'TikTok',
    //   description: 'TikTok',
    //   imgSrc: './assets/img/elite/CesarVega/TikTok.png',
    // },
    // {
    //   name: 'WhatsApp',
    //   description: 'WhatsApp',
    //   imgSrc: './assets/img/elite/CesarVega/WhatsApp.png',
    // },
    // {
    //   name: 'Message',
    //   description: 'Message',
    //   imgSrc: './assets/img/elite/CesarVega/Message.png',
    // },
    // {
    //   name: 'GMAIL',
    //   description: 'GMAIL',
    //   imgSrc: './assets/img/elite/CesarVega/GMAIL.png',
    // },
    // {
    //   name: 'Phone',
    //   description: 'Phone',
    //   imgSrc: './assets/img/elite/CesarVega/Phone.png',
    // },
    // {
    //   name: 'Ca$hApp',
    //   description: 'Ca$hApp',
    //   imgSrc: './assets/img/elite/CesarVega/Ca$hApp.png',
    // },
    // {
    //   name: 'Zelle',
    //   description: 'Zelle',
    //   imgSrc: './assets/img/elite/CesarVega/Zelle.png',
    // },
    // {
    //   name: 'Venmo',
    //   description: 'Venmo',
    //   imgSrc: './assets/img/elite/CesarVega/Venmo.png',
    // },
    // {
    //   name: 'PayPal',
    //   description: 'PayPal',
    //   imgSrc: './assets/img/elite/CesarVega/PayPal.png',
    // },
    // {
    //   name: 'BitCoin',
    //   description: 'BitCoin',
    //   imgSrc: './assets/img/elite/CesarVega/BitCoin.png',
    // },
    // {
    //   name: 'DogeCoin',
    //   description: 'DogeCoin',
    //   imgSrc: './assets/img/elite/CesarVega/DogeCoin.png',
    // },
    // {
    //   name: 'Sound Cloud',
    //   description: 'Sound Cloud',
    //   imgSrc: './assets/img/elite/CesarVega/Sound Cloud.png',
    // },
    // {
    //   name: 'Spotify',
    //   description: 'Spotify',
    //   imgSrc: './assets/img/elite/CesarVega/Spotify.png',
    // },
    // {
    //   name: 'YouTube',
    //   description: 'YouTube',
    //   imgSrc: './assets/img/elite/CesarVega/YouTube.png',
    // },
    // {
    //   name: 'Wifi',
    //   description: 'Wifi',
    //   imgSrc: './assets/img/elite/CesarVega/Wifi.png',
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

  myAngularxQrCode = 'http://mrvrman.com/eliteCesar';
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

    this.getCoffeeOrders();
    


    // this.EliteService.createCoffeeOrder({ qrcodeId: 1, name: 'cesar vega', userid: 1 }).then(res => {
    //   console.log(res);

    // })


  }

  coffeeOrders;
  getCoffeeOrders = () =>
    this.EliteService
      .getCoffeeOrders()
      .subscribe((res:any)=> {
        this.coffeeOrders = res;
        this.updatePromoter(this.coffeeOrders[0]);
      }
      );


      updatePromoter(promoter){
        this.EliteService.updateCoffeeOrder(promoter)
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

  crypto() {
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


  }



  qrcode() {
    // let newVariable2 = (window.navigator as any)

    this.popUpQRCode = !this.popUpQRCode;
    // if (newVariable2.share) {
    //   newVariable2.share({
    //     title: 'MIAMI LUXURY RIDES',
    //     text: 'SHARE ME',
    //     url: 'http://mrvrman.com/luxury-rides',
    //   })
    //     .then(() => console.log('Successful share'))
    //     .catch((error) => console.log('Error sharing', error));
    // }
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

  openGoogleForm() {
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


 

  
  // SOCIAL MEDIA QRCODES

  // Instagram   =   https://www.instagram.com/YOUR_USERNAME
  // TikTok      =   https://vm.tiktok.com/YOUR_USERNAME
  // FaceBook    =   https://facebook.com/YOUR_USERNAME
  // LinkIn      =   https://www.linkedin.com/in/YOUR_USERNAME/
  // Tweeter     =   https://twitter.com/YOUR_USERNAME
  // SnapChat    =   https://www.snapchat.com/YOUR_USERNAME

  // MESSAGES & PHONE QRCODES

  // WhatsApp     =   YOUR_PHONE_NUMBER, text    = Hello_Cesar_Vega
  // TxT-Message  =   YOUR_PHONE_NUMBER; Message = Hello Cesar Vega  
  // Phone Number =   YOUR_PHONE_NUMBER
  // GMAIL        =   YOUR_EMAIL, MENSAGE, SUBJECT


  // PAYMENTS QRCODES
  // Ca$hApp     =   YOUR_USERNAME
  // Venmo       =   YOUR_USERNAME
  // Zelle       =   ZELLE EMAIL, or PHONE NUMBER , First name  and Last name
  // PayPal      =   YOUR_USERNAME
  // BitCoin     =   BITCOIN_ADDRESS : 12sN4AYbGDZ9vgKKw8XoN4rhsmSiq4ztRz
  // DogeCoin    =   DOGECOIN_ADDRESS : 12sN4AYbGDZ9vgKKw8XoN4rhsmSiq4ztRz
  // CRYPTO      =   CRYPTO_ADDRESS : 12sN4AYbGDZ9vgKKw8XoN4rhsmSiq4ztRz

  // ARTIST QRCODES

  // Sound Cloud   =   SOUND_CLOUD  URL
  // YouTube       =   YOUTUBE URL
  // Spotify       =   SPOTIFY URL

  // BUSINESS OR PERSONAL QRCODES

  // Website   =  www.yourwebste.com
  // Wifi      =   WIFI Name: WIFI:PASSWORD

  // ADD NOT LISTED QRCODE

  // URL = "  "
