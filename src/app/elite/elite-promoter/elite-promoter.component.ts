import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
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
  qrocodeColor = '#629d5d';
  qrocodeColorBackground = '#ffffff00';
  QRLOGO = '<img  src="./assets/img/elite/CesarVega/CesarRecruiter.png">'

  popUpQRCode = false;
  // popUpThankyou = false;
  // popUpReview = false;
  // foodTopping;
  // foodOption;
  // sendingOrder: any;
  // selectedOption;
  // paramsArray: any; 
  clientEmail = '';
  clientName = '';
  clientPhone = '';
  isClientForm = false;

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
        venueId: 'Baoili',
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
          promoId: 'Baoili',
          promoName: 'Discount',
          description: '10 % Discount',
          imgSrc: './assets/img/elite/Promoters/ClientQrCode.png'
        },
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
        venueId: 'asd',
        venueName: 'SBA',
        description: 'SBA',
        imgSrc: './assets/img/elite/SBA.jpg'
      },
      {
        venueId: 'fgh',
        venueName: 'TIENDITA',
        description: 'TIENDITA',
        imgSrc: './assets/img/elite/TIENDITA.jpg'

      }
      ],
      promotions: [
        {
          promoId: 'asd',
          promoName: 'Discount',
          description: '10 % Discount',
          imgSrc: './assets/img/elite/discount.jpg'
        },
        {
          promoId: 'fgh',
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
  guessAmount = 1;
  clientguessAmount = 1;
  secretVenueKey = '';
  GUESS_AMOUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  submitButtonReady = true;
  isClientScanned = false;
  goToTheVenue = false;


  promotionalUniqueId = '';
  canvas: any = 'canvas';

  constructor(@Inject(DOCUMENT) document, private paramsRouter: ActivatedRoute, private EliteService: EliteService) {


  }


  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.promoterId = params['id'];
      this.qrcodeType = params['type'];
      this.VenueId = params['venueId'];
    });



    if (this.qrcodeType === 'client-scanning') {
      // ESCANING QR AT THE VENUE
      this.promotionalUniqueId = localStorage.getItem(this.VenueId);
      this.myAngularxQrCode = this.myAngularxQrCode + this.promotionalUniqueId
      this.title = this.VenueId;
      this.isClientScanned = true;
      this.EliteService.getPromoters(this.promotionalUniqueId)
        .subscribe((arg: any) => {
          if (arg.payload.data().completed === 'complete') {
            this.popUpQRCode = false;
            this.isPromtionSucess = true;
          }
        });

    }
    else if (this.qrcodeType === 'client') {
      this.isClientForm = true
    }
    else if (this.qrcodeType === 'venue') {

      this.isVenueForm = true;

      this.EliteService.getPromoters(this.VenueId)
        .subscribe((arg: any) => {
          this.venueName = arg.payload.data().venueId;
          this.title = this.venueName;
        });

    }
    else if (this.qrcodeType === 'promoter') {
      this.title = 'SCAN PROMOTION'
      this.PROMOTERS.forEach((promoter, index) => {
        if (this.promoterId === promoter.promoterId) {
          this.VENUES = promoter.venues;
        }
      });
    }
  }

  validatePromotion() {
    this.EliteService.getPromoters(this.VenueId)
      .subscribe((arg: any) => {
        if (arg.payload.data().completed === 'inprogress') {
          console.log('cupon inprogress')
          this.isVenueForm = false;
          this.isPromtionSucess = true;
          this.EliteService.updatePromoter(this.VenueId,this.guessAmount,this.secretVenueKey).then(res => {
          })
        }
        else {
          console.log('cupon already completed');
          if (!this.isPromtionSucess) {
            this.isVenueForm = false;
            this.isPromotionsExpired = true;
            this.title = 'COMPLETED';
          }
        }
      });
  }

  validateGuessAmount() {
    this.EliteService.updateClientGuess(localStorage.getItem(this.VenueId),this.clientguessAmount).then(res => {
    })
    this.popUpQRCode = true;
    this.isClientScanned = false;
  }

  isClientInfoReady() {
    this.isClientForm = false;
    this.goToTheVenue = true;
    if (this.qrcodeType === 'client') {
      this.title = 'PROMOTION  CODE'
      this.PROMOTERS.forEach((promoter, index) => {
        if (this.promoterId === promoter.promoterId) {
          this.EliteService.createPromoter(
            { promoterId: this.promoterId, venueId: this.VenueId, clientEmail: this.clientEmail,clientName: 
              this.clientName,clientPhone:  this.clientPhone, completed: 'inprogress', created: new Date() }).then(res => {
            this.venueName = this.VenueId;
            localStorage.setItem(this.venueName, res);
          }).catch(err => {
            console.log(err);
          });
        }
      });
    }
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
