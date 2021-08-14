import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';


@Component({
  selector: 'app-elite-promotion',
  templateUrl: './elite-promotion.component.html',
  styleUrls: ['./elite-promotion.component.scss']
})
export class ElitePromotionComponent implements OnInit {
 

  title = 'ELITE'
  PromotionName = 'Baoli Disscount';
  PromoDescription = 'All customer coming with this digital coupon will obtain 10% discount on the final bill';
  PromotionRate = '10%';
  PromotionRules = 'Apply only between 10:00 AM until 7:00 PM';
  popUpQRCode: boolean;
  PromotionId: any;
  emailregistered = false;

  PromotionInfo = {
    PromotionName: this.PromotionName,
    PromoDescription: this.PromoDescription,
    PromotionRate: this.PromotionRate,
    PromotionRules: this.PromotionRules,
    updated: new Date(),
    created: new Date()
  }

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.PromotionId = params['id'];
    });

    this.PromotionId = localStorage.getItem('PromotionId');
    if (this.PromotionId) {
      this.EliteService.getPromotionById(this.PromotionId).subscribe((arg: any) => {
        if (arg.payload.data()) {
          this.PromotionInfo = arg.payload.data()
        }
      });
    }
  }

  qrcode() {
    this.popUpQRCode = !this.popUpQRCode;
  }

  reset() {
    this.PromotionInfo = {
      PromotionName: '',
      PromoDescription: '',
      PromotionRate: '',
      PromotionRules: '',
      updated: new Date(),
      created: new Date()
    }
  }

  resetEmailError() {
    this.emailregistered = false
  }

  createOrUpdatePromotion() {
    this.EliteService.getPromotionById(this.PromoDescription).subscribe((arg: any) => {
      if (arg.payload.exists) {
        console.log('this Promotion is already registered')
        this.emailregistered = true
      } else {
        this.PromotionInfo = {
          PromotionName: this.PromotionName,
          PromoDescription: this.PromoDescription,
          PromotionRate: this.PromotionRate,
          PromotionRules: this.PromotionRules,
          updated: new Date(),
          created: new Date()
        }
        this.EliteService.createPromotion(this.PromotionInfo).then(res => {
          localStorage.setItem('PromotionId', res)
        })
      }
    });
  }
}
