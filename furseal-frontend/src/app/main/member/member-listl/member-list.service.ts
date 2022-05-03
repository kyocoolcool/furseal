import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Member} from '../member.model';

@Injectable()
export class MemberListService {
  private readonly backendUrl = '/api/members';
  rows: any;
  onDatatablessChanged: BehaviorSubject<any>;
  onProductsChanged = new Subject<Member[]>();
  private members: Member[] = [];

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

  storeProduct(member: Member) {
    this._httpClient.put(
            this.backendUrl,
        member
        )
        .subscribe(response => {
          console.log(response);
        });
  }

  fetchProductOrders() {
    this._httpClient
        .get<Member[]>(
            this.backendUrl
        ).subscribe(product => {
      this.setOrders(product);
    });
  }


  setOrders(members: Member[]) {
    this.members = members;
    this.onProductsChanged.next(this.members.slice());
  }

  getProductOrders() {
    return this.members.slice();
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

  deleteDataTableRows(memberId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${this.backendUrl}/${memberId}`).subscribe((response: any) => {
        this.rows = this.rows.filter(member => member.memberId != memberId);
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
