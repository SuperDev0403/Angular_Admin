import { Injectable } from '@angular/core';
import { ServiceUtils } from '../serviceUtils';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private serviceUtils: ServiceUtils) { }

  public getUsers() {
    return this.serviceUtils.ApiGET('users/getUsers');
  }

  public addUser(user: any) {
    return this.serviceUtils.ApiPOST('users/addUser',
      {
        email: user.email,
        name: user.name,
        client_id: user.client_id,
        password: user.password,
        role: user.role,
        is_active: user.is_active
      }
    );
  }

  public editUser(user: any) {
    return this.serviceUtils.ApiPOST('users/editUser',
      {
        id: user.id,
        email: user.email,
        name: user.name,
        client_id: user.client_id,
        password: user.password,
        role: user.role,
        is_active: user.is_active
      }
    );
  }

  public removeUser(id) {
    return this.serviceUtils.ApiPOST('users/deleteUser', { id: id });
  }

  public getClients() {
    return this.serviceUtils.ApiGET('users/getClients');
  }

  public addClient(client: any) {
    return this.serviceUtils.ApiPOST('users/addClient',
      {
        client_name: client.client_name,
        client_cif: client.client_cif,
        client_type_id: client.client_type_id,
        client_is_active: client.client_is_active
      }
    );
  }

  public editClient(client: any) {
    return this.serviceUtils.ApiPOST('users/editClient',
      {
        client_id: client.client_id,
        client_name: client.client_name,
        client_cif: client.client_cif,
        client_type_id: client.client_type_id,
        client_is_active: client.client_is_active
      }
    );
  }

  public removeClient(id) {
    return this.serviceUtils.ApiPOST('users/deleteClient', { client_id: id });
  }

  public getClientmodules() {
    return this.serviceUtils.ApiGET('users/getClientmodules');
  }

  public addClientmodule(client: any) {
    return this.serviceUtils.ApiPOST('users/addClientmodule',
      {
        client_module_id: client.client_module_id,
        client_module_client_id: client.client_module_client_id,
        client_module_marketplace_id: client.client_module_marketplace_id,
        client_module_is_review: client.client_module_is_review, 
        client_module_is_content: client.client_module_is_content,
        client_module_is_price: client.client_module_is_price,
        client_module_is_answers: client.client_module_is_answers,
        client_module_is_po: client.client_module_is_po,
        client_module_is_active: client.client_module_is_active
      }
    );
  }

  public editClientmodule(client: any) {
    return this.serviceUtils.ApiPOST('users/editClientmodule',
      {
        client_module_id: client.client_module_id,
        client_module_client_id: client.client_module_client_id,
        client_module_marketplace_id: client.client_module_marketplace_id,
        client_module_is_review: client.client_module_is_review, 
        client_module_is_content: client.client_module_is_content,
        client_module_is_price: client.client_module_is_price,
        client_module_is_answers: client.client_module_is_answers,
        client_module_is_po: client.client_module_is_po,
        client_module_is_active: client.client_module_is_active
      }
    );
  }

  public removeClientmodule(id) {
    return this.serviceUtils.ApiPOST('users/deleteClientmodule', { client_module_id: id });
  }

  public getAsinListing() {
    return this.serviceUtils.ApiGET('product/getAsinListing');
  }

  public addAsin(asin: any) {
    return this.serviceUtils.ApiPOST('product/addAsin', {
      product_client_id: asin.product_client_id,
      client_name: asin.client_name,
      product_asin: asin.product_asin,
      product_module_marketplace_id: asin.product_module_marketplace_id,
      product_module_is_review: asin.product_module_is_review,
      product_module_is_price: asin.product_module_is_price,
      product_module_price_msrp: asin.product_module_price_msrp,
      product_module_price_base: asin.product_module_price_base
    });
  }

  public editAsin(asin: any) {
    return this.serviceUtils.ApiPOST('product/editAsin', {
      product_module_id: asin.product_module_id,
      product_module_product_id: asin.product_module_product_id,
      product_client_id: asin.product_client_id,
      product_module_marketplace_id: asin.product_module_marketplace_id,
      product_module_is_review: asin.product_module_is_review,
      product_module_is_price: asin.product_module_is_price,
      product_module_price_msrp: asin.product_module_price_msrp,
      product_module_price_base: asin.product_module_price_base
    });
  }

  public removeAsin(id) {
    return this.serviceUtils.ApiPOST('product/deleteAsin', { product_module_id: id });
  }

  public uploadFile(formdata) {
    return this.serviceUtils.formPOST('product/uploadFile', formdata);
  }

  public getReviews() {
    return this.serviceUtils.ApiGET('product/getReviews');
  }

  public getReputation(marketplace_id, product_client_id) {
    return this.serviceUtils.ApiPOST('brand/getReputation', { 
      marketplace_id: marketplace_id,
      product_client_id: product_client_id 
    });
  }
}
