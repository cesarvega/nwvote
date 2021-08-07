import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';

@Component({
  selector: 'app-elite-promoter',
  templateUrl: './elite-promoter.component.html',
  styleUrls: ['./elite-promoter.component.scss']
})
export class ElitePromoterComponent implements OnInit {

  myAngularxQrCode = 'http://mrvrman.com/elite/elite/1234/venue/';
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
  promoterId: any;
  qrcodeType: any;
  Id: any;
  title = 'CESAR VEGA';
  clientId: any;
  PROMOTERS = [
    {
      promoterId: '1234',
      promoterName: 'Juan Velez',
      venues: [{
        venueId: 'xyz',
        venueName: 'BAOLI',
        description: 'BAOLI',
        imgSrc: './assets/img/elite/BAOILI.jpg'
      },
      {
        venueId: 'abc',
        venueName: 'CASATUA',
        description: 'BAOLI',
        imgSrc: './assets/img/elite/CASATUA.jpg'

      }
      ],
      promotions: [
        {
          promoId: 'abc',
          promoName: 'Discount',
          description: '10 % Discount',
          imgSrc: './assets/img/elite/Promoters/ClientQrCode.png'
        }
      ]
    },
    {
      promoterId: '3456',
      promoterName: 'Peter Albeiro',
      venues: [{
        venueId: 'zasd',
        venueName: 'BAOLI',
        description: 'BAOLI',
        imgSrc: './assets/img/elite/BAOILI.jpg'
      },
      {
        venueId: 'wesr',
        venueName: 'CASATUA',
        description: 'BAOLI',
        imgSrc: './assets/img/elite/CASATUA.jpg'

      }
      ],
      promotions: [
        {
          promoId: 'zasd',
          promoName: 'Discount',
          description: '10 % Discount',
          imgSrc: './assets/img/elite/discount.jpg'
        }
      ]
    }
  ]


  VENUES: any = []



// VENUE SCAN VARS
  VenueId: any;
  isVenueForm = false;
  venueName = 'sample';
  isPromotionsExpired = false;
  isPromtionSucess = false;
  guessAmount = 0;
  secretVenueKey = '';
  GUESS_AMOUNT_OPTIONS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  submitButtonReady = true;

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.promoterId = params['id'];
      this.qrcodeType = params['type'];
      this.VenueId = params['venueId'];
    });


    if (this.qrcodeType === 'client') {
      this.PROMOTERS.forEach((promoter, index) => {
        if (this.promoterId === promoter.promoterId) {
          this.VENUES = promoter.promotions;
          this.EliteService.createPromoter({ promoterId: this.promoterId, venueId: this.VenueId, completed: 'inprogress', created: new Date() }).then(res => {
            this.myAngularxQrCode = this.myAngularxQrCode + res;
          }).catch(err => {
            console.log(err);
          });
        }
      });
    }
    else if (this.qrcodeType === 'venue') {
      this.title = 'VENUE SCAN';
      this.isVenueForm = true;

      this.EliteService.getPromoters(this.VenueId)
      .subscribe((arg:any) => {
       this.venueName = arg.payload.data().venueId;
      });
    }
    else if (this.qrcodeType === 'promoter') {
      this.PROMOTERS.forEach((promoter, index) => {
        if (this.promoterId === promoter.promoterId) {
          this.VENUES = promoter.venues;
        }
      });
    }



    // this.getPromoters();

  }


  // SCAN AND SEND DATA
  // sendQrCode(item, index) {
  //   if (item === this.VENUES[index].venueId) {
  //     this.EliteService.createPromoter({ promoterId: this.promoterId, venueId: this.VENUES[index].venueId, created: new Date() }).then(res => {
  //       console.log(res);
  //     })
  //   }
  // }


  validatePromotion(){
    this.EliteService.getPromoters(this.VenueId)
    .subscribe((arg:any) => {
      if (arg.payload.data().completed === 'inprogress') {
        console.log('cupon inprogress')        
        this.isVenueForm = false;
        this.isPromtionSucess = true;
            this.EliteService.updatePromoter(this.VenueId).then(res => {              
            })
      }
      else
      {  
        console.log('cupon already completed');
        if (!this.isPromtionSucess) {
          this.isVenueForm = false;
          this.isPromotionsExpired = true;  
        }
        
       }
    });
  }

  crypto() {
    window.open('https://commerce.coinbase.com/checkout/d983d382-1345-4214-9518-fb7d3ca97b27', "_top");
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
