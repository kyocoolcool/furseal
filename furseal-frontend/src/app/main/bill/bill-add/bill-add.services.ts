import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {Bill} from '../bill.model';

@Injectable()
export class BillAddService implements Resolve<any> {
    private readonly backendUrl = '/api/bills';
    apiData: any;
    onBillEditChanged: BehaviorSubject<any>;
    id;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onBillEditChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        let currentId = Number(route.paramMap.get('id'));
        return new Promise<void>((resolve, reject) => {
            Promise.all([this.getApiData(currentId)]).then(() => {
                resolve();
            }, reject);
        });
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
                this.onBillEditChanged.next(this.apiData);
                resolve(this.apiData);
            }, reject);
        });
    }

    createBill(formData: FormData): Promise<any[]> {
        const url = `${this.backendUrl}`;
        return new Promise((resolve, reject) => {
            this._httpClient.post(url,formData).subscribe((response: any) => {
                console.log(`response: ${response}`);
                this.apiData = response;
                this.onBillEditChanged.next(this.apiData);
                resolve(this.apiData);
            },reject);
        });
    }
}
