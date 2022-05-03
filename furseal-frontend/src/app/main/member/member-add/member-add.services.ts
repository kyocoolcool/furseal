import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {Member} from '../member.model';

@Injectable()
export class MemberAddService implements Resolve<any> {
    private readonly backendUrl = '/api/members';
    apiData: any;
    onMemberEditChanged: BehaviorSubject<any>;
    id;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onMemberEditChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

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
                this.onMemberEditChanged.next(this.apiData);
                resolve(this.apiData);
            }, reject);
        });
    }

    createMember(member: Member): Promise<any[]> {
        const url = `${this.backendUrl}`;
        return new Promise((resolve, reject) => {
            this._httpClient.post(url,member).subscribe((response: any) => {
                this.apiData = response;
                this.onMemberEditChanged.next(this.apiData);
                resolve(this.apiData);
            }, reject);
        });
    }


}
