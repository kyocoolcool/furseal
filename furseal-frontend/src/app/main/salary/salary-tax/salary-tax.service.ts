import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Bill} from '../../bill/bill.model';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class SalaryTaxService {
  private readonly backendUrl = '/api/bills';
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
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  storeProduct(bill: Bill) {
    this._httpClient.put(
            this.backendUrl,
        bill
        )
        .subscribe(response => {
          console.log(response);
        });
  }

  fetchProductOrders() {
    this._httpClient
        .get<Bill[]>(
            this.backendUrl
        ).subscribe(bills => {
          console.log('0-2')
      this.setOrders(bills);
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
      this._httpClient.get(`${this.backendUrl}/salaries/tax`).subscribe((response: any) => {
        console.log(response);
        this.rows = response;
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  deleteDataTableRows(billId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${this.backendUrl}/${billId}`).subscribe((response: any) => {
        console.log(response);
        this.rows = this.rows.filter(bill => bill.billId != billId);
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  querySalary(fromDate: NgbDate, toDate: NgbDate ) {
    let params: any = {
      'fromDateYear': fromDate.year,
      'fromDateMonth': fromDate.month,
      'fromDateDay': fromDate.day,
      'toDateYear': toDate.year,
      'toDateMonth': toDate.month,
      'toDateDay': toDate.day
    };
    const url = `${this.backendUrl}/salariesByDate`;
    return new Promise((resolve, reject) => {
      this._httpClient.get(url, {params: params}).subscribe((response: any) => {
        this.rows = response;
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
