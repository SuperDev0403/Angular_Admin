import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '../../shared/ui/ui.module';
import { NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TranslateModule } from '@ngx-translate/core';

import { PriceMonitoringRoutingModule } from './price-monitoring-routing.module';
import { SellerPricingComponent } from './seller-pricing/seller-pricing.component';

import { AdvancedSortableDirective } from './sortable.directive';
import { SellerProductListingComponent } from './seller-product-listing/seller-product-listing.component';
import { ProductComparisonComponent } from './product-comparison/product-comparison.component';
import { ProductListingComponent } from './product-listing/product-listing.component';

@NgModule({
  declarations: [SellerPricingComponent, AdvancedSortableDirective, SellerProductListingComponent, ProductComparisonComponent, ProductListingComponent],
  imports: [
    CommonModule,
    PriceMonitoringRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbModalModule,
    NgbPaginationModule,
    NgApexchartsModule,
    NgbTypeaheadModule,
    Ng2SearchPipeModule,
    TranslateModule
  ]
})
export class PriceMonitoringModule { }
