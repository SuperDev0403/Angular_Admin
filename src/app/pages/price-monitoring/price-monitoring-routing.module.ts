import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellerPricingComponent } from './seller-pricing/seller-pricing.component';
import { SellerProductListingComponent } from './seller-product-listing/seller-product-listing.component';
import { ProductComparisonComponent } from './product-comparison/product-comparison.component';
import { ProductListingComponent } from './product-listing/product-listing.component';

const routes: Routes = [
  {
    path: 'seller-pricing',
    component: SellerPricingComponent
  },
  {
    path: 'seller-prodcut-listing/:seller_id/:seller_name',
    component: SellerProductListingComponent
  },
  {
    path: 'product-comparison/:ean/:product_name/:product_photoUri',
    component: ProductComparisonComponent
  },
  {
    path: 'product-listing',
    component: ProductListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceMonitoringRoutingModule { }
