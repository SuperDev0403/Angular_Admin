import { Injectable } from '@angular/core';
import { ServiceUtils } from '../serviceUtils';

@Injectable({
  providedIn: 'root'
})
export class BoardfyService {

  constructor(private serviceUtils: ServiceUtils) { }

  public getSellerPricingStats(mc: string, date: string) {
    return this.serviceUtils.ApiPOST('boardfy/getSellerPricingStats', { mc, date });
  }

  public getSellerPricing(mc: string, date: string) {
    return this.serviceUtils.ApiPOST('boardfy/getSellerPricing', { mc, date });
  }

  public getSellerProductListing(mc, date, seller_id) {
    return this.serviceUtils.ApiPOST('boardfy/getSellerProductListing', { mc, date, seller_id });
  }

  public getProductListingStats(mc, date) {
    return this.serviceUtils.ApiPOST('boardfy/getProductListingStats', { mc, date });
  }

  public getProductListing(mc, date) {
    return this.serviceUtils.ApiPOST('boardfy/getProductListing', { mc, date });
  }

  public getSellerProductComparison(mc, date, ean) {
    return this.serviceUtils.ApiPOST('boardfy/getSellerProductComparison', { mc, date, ean });
  }

  public getAllProductsAndSellersStats(mc, date) {
    return this.serviceUtils.ApiPOST('boardfy/getAllProductsAndSellersStats', { mc, date });
  }

  public getAllProductsAndSellers(mc, date) {
    return this.serviceUtils.ApiPOST('boardfy/getAllProductsAndSellers', { mc, date });
  }

  public getDatesales(id, date) {
    return this.serviceUtils.ApiPOST('boardfy/getDatesales', { id, date });
  }

  public getVendorCodes(id) {
    return this.serviceUtils.ApiPOST('boardfy/getVendorCodes', { id });
  }

  public getKeyFifures(id, vc) {
    return this.serviceUtils.ApiPOST('boardfy/getKeyFifures', { id, vc });
  }

  public getInvoiceEvolution(id, vc, frommonth, tomonth) {
    return this.serviceUtils.ApiPOST('boardfy/getInvoiceEvolution', { id, vc, frommonth, tomonth });
  }  

  public getMostInvoicedProducts(id, vc, frommonth, tomonth) {
    return this.serviceUtils.ApiPOST('boardfy/getMostInvoicedProducts', { id, vc, frommonth, tomonth });
  } 

  public getKeyRejFigures(id, vc) {
    return this.serviceUtils.ApiPOST('boardfy/getKeyRejFigures', { id, vc });
  }

  public getMonthlyInvoiceLoss(id, vc, frommonth, tomonth) {
    return this.serviceUtils.ApiPOST('boardfy/getMonthlyInvoiceLoss', { id, vc, frommonth, tomonth });
  }  
  
  public getMostInvoiceLostProducts(id, vc, frommonth, tomonth) {
    return this.serviceUtils.ApiPOST('boardfy/getMostInvoiceLostProducts', { id, vc, frommonth, tomonth });
  }
}
