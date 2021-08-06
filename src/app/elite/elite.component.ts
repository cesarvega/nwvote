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

    this.getPromoters();
    
    this.EliteService.createPromoter({ qrcodeId: 1, name: 'cesar vega', userid: 1 }).then(res => {
      console.log(res);

    })

  }

  Promoters;
  getPromoters = () =>
    this.EliteService
      .getPromoters()
      .subscribe((res:any)=> {
        this.Promoters = res;
        // this.updatePromoter(this.Promoters[0]);
      }
      );
      updatePromoter(promoter){
        this.EliteService.updatePromoter(promoter)
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


  qrcode() {
    this.popUpQRCode = !this.popUpQRCode;

  }
  

}

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
