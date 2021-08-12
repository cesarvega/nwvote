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

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.PromoterId = params['id'];
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
