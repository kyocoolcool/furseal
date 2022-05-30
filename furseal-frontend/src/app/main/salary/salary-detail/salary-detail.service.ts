import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Bill} from '../../bill/bill.model';
import {Member} from '../../member/member.model';

@Injectable()
export class SalaryDetailService {
  private readonly backendUrl = '/api/members';
  rows: any;
  onDatatablessChanged: BehaviorSubject<any>;
  onBillsChanged = new Subject<Bill[]>();
  private bills: Bill[] = [];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onDatatablessChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    console.log(`route:${route.data.name}`);
    return new Promise<void>((resolve, reject) => {
      // Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      // }, reject);
    });
  }

  setOrders(orders: Bill[]) {
    this.bills = orders;
    this.onBillsChanged.next(this.bills.slice());
  }

  getProductOrders() {
    return this.bills.slice();
  }

  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.backendUrl}/salaries`).subscribe((response: any) => {
        console.log(response);
        this.rows = response;
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  querySalary(memberId: number,fromDateYear: number, fromDateMonth: number, fromDateDay: number, toDateYear: number, toDateMonth: number,toDateDay: number ):Observable<Member>  {
    let params: any = {
      'fromDateYear': fromDateYear,
      'fromDateMonth': fromDateMonth,
      'fromDateDay': fromDateDay,
      'toDateYear': toDateYear,
      'toDateMonth': toDateMonth,
      'toDateDay': toDateDay
    };
    const url = `${this.backendUrl}/salaries/${memberId}`;
    return this._httpClient.get<Member>(url, {params: params});
  }

  querySalaryNoDeal(memberId: number,fromDateYear: number, fromDateMonth: number, fromDateDay: number, toDateYear: number, toDateMonth: number,toDateDay: number ):Observable<Member>  {
    let params: any = {
      'fromDateYear': fromDateYear,
      'fromDateMonth': fromDateMonth,
      'fromDateDay': fromDateDay,
      'toDateYear': toDateYear,
      'toDateMonth': toDateMonth,
      'toDateDay': toDateDay
    };
    const url = `${this.backendUrl}/salaries/nodeal/${memberId}`;
    return this._httpClient.get<Member>(url, {params: params});
  }
}
