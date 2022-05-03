import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {Member} from '../member.model';

@Injectable()
export class MemberEditService implements Resolve<any> {
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
        const url = `${this.backendUrl}/user/${id}`;
        this.id = id;
        return new Promise((resolve, reject) => {
            this._httpClient.get(url).subscribe((response: any) => {
                console.log(response);
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

    updateMember(member: Member): Promise<any[]> {
        console.log(member);
        const url = `${this.backendUrl}/${member.memberId}`;
        return new Promise((resolve, reject) => {
            this._httpClient.put(url,member).subscribe((response: any) => {
                console.log(`response: ${response}`);
                this.apiData = response;
                this.onMemberEditChanged.next(this.apiData);
                resolve(this.apiData);
            }, reject);
        });
    }
}
