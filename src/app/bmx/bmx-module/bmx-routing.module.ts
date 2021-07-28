import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BmxCreatorComponent } from '../bmx-creator/bmx-creator.component';
import { BmxComponent } from '../bmx-survey/bmx.component';


const routes: Routes = [
  //  {//BI BRAND MATRIX SURVEY
  //   path: ':id',
  //   component: BmxComponent
  // },
  {//BI BRAND MATRIX CREATOR
  path: ':id',
   component: BmxCreatorComponent
  },
  {
    path: '',
    redirectTo: '/id',
    pathMatch: 'full'
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class BmxRoutingModule { }
