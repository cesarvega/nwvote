import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliteComponent } from './elite/elite.component';
import { ElitePromoterComponent } from './elite/elite-promoter/elite-promoter.component';
import { EliteDashComponent } from './elite/elite-dash/elite-dash.component';
import { EliteBusinessComponent } from './elite/elite-business/elite-business.component';
import { EliteVenueComponent } from './elite/elite-venue/elite-venue.component';
import { ElitePromotionComponent } from './elite/elite-promotion/elite-promotion.component';
import { EliteQrCodeDesignerComponent } from './elite/elite-qr-code-designer/elite-qr-code-designer.component';
import { EliteCorporateComponent } from './elite/elite-corporate/elite-corporate.component';
import { EliteAuthComponent } from './elite/elite-auth/elite-auth.component';
import { EliteAuthGuard } from './elite/elite-auth/elite-auth.guard';
import { EliteBusinessCardComponent } from './elite/elite-business-card/elite-business-card.component';
const routes: Routes = [

  {//ELITE BUSINESS
    path: 'auth',
    component: EliteAuthComponent
  },


  {//ELITE BUSINESS
    path: 'business-card',
    component: EliteBusinessCardComponent,
     // canActivate: [EliteAuthGuard]
  },

  {//ELITE BUSINESS
    path: 'business',
    component: EliteBusinessComponent
  },
  {//ELITE BUSINESS WITH ID
    path: 'business/:id',
    component: EliteBusinessComponent
  },


  /***
   * ELITE MARKETING APP
   */

  {//ELITE VENUE
    path: 'venue',
    component: EliteVenueComponent
  },
  {//ELITE VENUE WITH ID
    path: 'venue/:id',
    component: EliteVenueComponent
  },

  {//ELITE PROMOTER 🙋‍♂️🙋‍♂️🙋‍♂️🙋‍♂️🙋‍♂️🙋‍♂️🙋‍♂️🙋‍♂️🙋‍♂️
    path: 'promoter',
    component: ElitePromoterComponent,
    // canActivate: [EliteAuthGuard]
  },
  {//ELITE PROMOTER WITH ID
    path: 'promoter/:id',
    component: ElitePromoterComponent
  },

  {//ELITE PROMOTION 👑👑👑👑👑👑👑👑👑👑
    path: 'promotion',
    component: ElitePromotionComponent
  },
  {//ELITE PROMOTION WITH ID
    path: 'promotion/:id',
    component: ElitePromotionComponent
  },

  {//ELITE DASHBOARD
    path: 'dash',
    component: EliteDashComponent
  },
  {//ELITE DASHBOARD
    path: 'qr',
    component: EliteQrCodeDesignerComponent
  },
  {//ELITE CORPORATE
    path: 'corporate',
    component: EliteCorporateComponent
  },

  {//ELITE SYSTEM UX UI
    path: 'UX/:id/:type',
    component: EliteComponent
  },
  {//ELITE SYSTEM UX UI
    path: 'UX/:id/:type/:venueId',
    component: EliteComponent
  },

  {
    path: '',
    redirectTo: 'promoter',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
