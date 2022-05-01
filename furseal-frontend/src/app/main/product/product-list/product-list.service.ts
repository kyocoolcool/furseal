import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Product} from '../product.model';

@Injectable()
export class ProductListService {
  private readonly backendUrl = '/api/products';
  rows: any;
  onDatatablessChanged: BehaviorSubject<any>;
  onProductsChanged = new Subject<Product[]>();
  private products: Product[] = [];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onDatatablessChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  storeProduct(product: Product) {
    this._httpClient.put(
            this.backendUrl,
        product
        )
        .subscribe(response => {
          console.log(response);
        });
  }

  fetchProductOrders() {
    this._httpClient
        .get<Product[]>(
            this.backendUrl
        ).subscribe(product => {
      this.setOrders(product);
    });
  }


  setOrders(products: Product[]) {
    this.products = products;
    this.onProductsChanged.next(this.products.slice());
  }

  getProductOrders() {
    return this.products.slice();
  }


  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.backendUrl).subscribe((response: any) => {
        this.rows = response;
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  deleteDataTableRows(productId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${this.backendUrl}/${productId}`).subscribe((response: any) => {
        this.rows = this.rows.filter(product => product.productId != productId);
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
