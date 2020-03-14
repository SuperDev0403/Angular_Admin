import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeModule } from './home/home.module';
import { PriceMonitoringModule } from './price-monitoring/price-monitoring.module';
import { PosModule } from './pos/pos.module';

import { PagesRoutingModule } from './pages-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    HomeModule,
    PagesRoutingModule,
    TranslateModule,
    PriceMonitoringModule,
    PosModule
  ]
})
export class PagesModule { }
