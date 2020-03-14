import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'monitor', loadChildren: () => import('./price-monitoring/price-monitoring.module').then(m => m.PriceMonitoringModule) },
  { path: 'pos', loadChildren: () => import('./pos/pos.module').then(m => m.PosModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
