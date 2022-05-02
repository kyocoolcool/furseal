import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {Product} from '../product.model';
import {Bill} from '../../bill/bill.model';

@Injectable()
export class ProductAddService implements Resolve<any> {
    private readonly backendUrl = '/api/products';
    apiData: any;
    onProductEditChanged: BehaviorSubject<any>;
    id;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onProductEditChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        // let currentId = Number(route.paramMap.get('id'));
        // return new Promise<void>((resolve, reject) => {
        //     Promise.all([this.getApiData(currentId)]).then(() => {
        //         resolve();
        //     }, reject);
        // });
    }

    /**
     * Get API Data
     */
    getApiData(id: number): Promise<any[]> {
        const url = `${this.backendUrl}/${id}`;
        this.id = id;
        return new Promise((resolve, reject) => {
            this._httpClient.get(url).subscribe((response: any) => {
                this.apiData = response;
                this.onProductEditChanged.next(this.apiData);
                resolve(this.apiData);
            }, reject);
        });
    }

    createProduct(product: Product): Promise<any[]> {
        const url = `${this.backendUrl}`;
        return new Promise((resolve, reject) => {
            this._httpClient.post(url,product).subscribe((response: any) => {
                this.apiData = response;
                this.onProductEditChanged.next(this.apiData);
                resolve(this.apiData);
            }, reject);
        });
    }


}
