import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';


@Component({
  selector: 'app-elite-corporate',
  templateUrl: './elite-corporate.component.html',
  styleUrls: ['./elite-corporate.component.scss']
})
export class EliteCorporateComponent implements OnInit {

  
  title = 'ELITE LLC'
  PromotionName = 'Baoli Disscount';
  PromoDescription = 'All customer coming with this digital coupon will obtain 10% discount on the final bill';
  PromotionRate = '10%';
  PromotionRules = 'Apply only between 10:00 AM until 7:00 PM';
  popUpQRCode: boolean;
  PromotionId: any;
  emailregistered = false;

  elisteSubtitle = `OUR MISSION`
  elistewhy = `Why do companies choose us? Our people, our process and a proven track record of exceptional results.`

  eliteCorpDescription  = `Welcome to Elite Digital Marketing,we are helping businesses to increase sales and get better 
  quality of clients using  our cutting edge, QR-Code technology tools.`

  eliteCorpDescription1 = `

  We will provide business strategy recommendations based on real data analytics collected on the first roll out of your promotion campaign over a fixed period of time.`

  eliteCorpDescription2 = `
  
  Great Promotional Strategies strike a fine balance between aspirational goals and actionable roadmaps. We will keep the best ones from every decision, through insights and data.`

  eliteCorpDescription3 = `
  
  The analyzed data will tell the quality of clients your business are getting from our promoters and in what direction to take action such as  increasing the amount of promoters that promote your business or making better promotions in order to achieve your sales growth.
   
  Our process combines imagination, collaboration and technology to produce exceptional creative work.`
  


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

  text() {
    window.open('https://wa.me/13053220070?text=Hola_Cesar_Vega', "_blank");
  }
  register() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeS5bYueV7XdmLbGtnAovvwj6XAhqyE3Rp5caX2fWHs1NkeoA/viewform', "_blank");
  }

 
}
