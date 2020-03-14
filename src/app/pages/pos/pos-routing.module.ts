import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoAnalysisComponent } from './po-analysis/po-analysis.component';
import { PoRejectionComponent } from './po-rejection/po-rejection.component';

const routes: Routes = [
  {
    path: 'analysis',
    component: PoAnalysisComponent
  }
  ,
  {
    path: 'rejection',
    component: PoRejectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
