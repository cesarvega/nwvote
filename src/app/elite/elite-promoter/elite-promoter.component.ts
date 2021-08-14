import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, AfterViewInit, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';

@Component({
  selector: 'app-elite-promoter',
  templateUrl: './elite-promoter.component.html',
  styleUrls: ['./elite-promoter.component.scss']
})
export class ElitePromoterComponent implements OnInit {

  title = 'ELITE'
  PromoterName = 'Cesar Vega';
  PromoterEmail = 'cesarvega.col@gmail.com';
  PromoterPayment = 'cashapp';
  PromoterBalance = '0';
  PromoterPhone = '3053220070';
  PromoterAddress = '201 SE 2nd ave, Miami, Fl, 33131';
  PromoterType = 'restaurant';
  popUpQRCode: boolean;
  PromoterId: any;
  emailregistered = false;
  isPromoterRegiter = true;

  promoterInfo = {
    PromoterName: this.PromoterName,
    PromoterEmail: this.PromoterEmail,
    PromoterPayment: this.PromoterPayment,
    PromoterBalance: this.PromoterBalance,
    PromoterPhone: this.PromoterPhone,
    PromoterAddress: this.PromoterAddress,
    PromoterType: this.PromoterType,
    updated: new Date(),
    created: new Date()
  }

  PROMOTERS = []

  VENUES: any = []

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  ngOnInit(): void {


    this.PROMOTERS = [
      {
        promoterId: 'cesarvega.col@gmail.com',
        promoterName: 'Juan Velez',
        venues: [{
          venueId: 'baoli',
          venueName: 'BAOLI',
          description: 'BAOLI',
          imgSrc: './assets/img/elite/BAOILI.jpg',
          qrCodeConfig:{
            color1: '#a664ac',
            color2: '#decddf',
            background: '#000000',
            cornersSquare: '#fff',
            logo: './assets/img/elite/logow.png',
            imageBackground: './assets/img/elite/Promoters/purpleBlack.png',
            qrCodeRenderUrl :'http://mrvrman.com/elite/UX/' + 'cesarvega.col@gmail.com' + '/client/baoli'
          }
        },
        {
          venueId: 'casatua',
          venueName: 'CASATUA',
          description: 'CASATUA',
          imgSrc: './assets/img/elite/CASATUA.jpg',
          qrCodeConfig:{
            color1: '#e28811',
            color2: '#613c0d',
            background: '#fff',
            cornersSquare: '#000',
            logo: './assets/img/elite/logo.png',
            imageBackground: './assets/img/elite/Promoters/orangeW.png',
            qrCodeRenderUrl :'http://mrvrman.com/elite/UX/' + 'cesarvega.col@gmail.com' + '/client/casatua'
          }
  
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
          imgSrc: './assets/img/elite/SBA.jpg',
          qrCodeConfig:{
            color1: '#9d64a1',
            color2: '#decddf',
            background: '#000000',
            cornersSquare: '#fff',
            logo: './assets/img/elite/logow.png',
            imageBackground: './assets/img/elite/Promoters/purpleBlack.png',
            qrCodeRenderUrl :'http://mrvrman.com/elite/UX/' + 'cesarvega.col@gmail.com' + '/client/baoli'
          }
        },
        {
          venueId: 'fgh',
          venueName: 'TIENDITA',
          description: 'TIENDITA',
          imgSrc: './assets/img/elite/TIENDITA.jpg',
          qrCodeConfig:{
            color1: '#9d64a1',
            color2: '#decddf',
            background: '#000000',
            cornersSquare: '#fff',
            logo: './assets/img/elite/logow.png',
            imageBackground: './assets/img/elite/Promoters/purpleBlack.png',
            qrCodeRenderUrl :'http://mrvrman.com/elite/UX/' + 'cesarvega.col@gmail.com' + '/client/baoli'
          }
  
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


    this.paramsRouter.params.subscribe(params => {
      this.PromoterId = (params['id']) ? params['id'] : localStorage.getItem('PromoterId');
      if (this.PromoterId) {
        this.isPromoterRegiter = false;
        this.title = 'SCAN PROMOTION'
        this.PROMOTERS.forEach((promoter, index) => {
          if (this.PromoterId === promoter.promoterId) {
            this.VENUES['promoter'] = promoter       
          }
        });
      
      }
    });

    this.PromoterId = localStorage.getItem('PromoterId');
    if (this.PromoterId) {
      this.EliteService.getPromoterById(this.PromoterId).subscribe((arg: any) => {
        if (arg.payload.data()) {
          this.promoterInfo = arg.payload.data()
        }
      });
    }
  }

  qrcode() {
    this.popUpQRCode = !this.popUpQRCode;
  }

  reset() {
    this.promoterInfo = {
      PromoterName: '',
      PromoterEmail: '',
      PromoterPayment: '',
      PromoterBalance: '',
      PromoterPhone: '',
      PromoterAddress: '',
      PromoterType: '',
      updated: new Date(),
      created: new Date()
    }
  }

  resetEmailError() {
    this.emailregistered = false
  }

  createOrUpdatePromoter() {
    this.EliteService.getPromoterById(this.PromoterEmail).subscribe((arg: any) => {
      if (arg.payload.exists) {
        console.log('this Promoter is already registered')
        this.emailregistered = true
      } else {
        this.promoterInfo = {
          PromoterName: this.PromoterName,
          PromoterEmail: this.PromoterEmail,
          PromoterPayment: this.PromoterPayment,
          PromoterBalance: this.PromoterBalance,
          PromoterPhone: this.PromoterPhone,
          PromoterAddress: this.PromoterAddress,
          PromoterType: this.PromoterType,
          updated: new Date(),
          created: new Date()
        }
        this.EliteService.createPromotor(this.promoterInfo).then(res => {
          localStorage.setItem('PromoterId', this.PromoterEmail)
        })
      }
    });
  }
}
