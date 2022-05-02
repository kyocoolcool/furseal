import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';

import {repeaterAnimation} from 'app/main//bill/bill.animation';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../share/data.service';
import {karmaTargetSpec} from '@angular-devkit/build-angular/src/test-utils';
import {DataStorageService} from '../../product/data-storage.service';
import {ProductService} from '../../product/product.service';
import {BillAddService} from './bill-add.services';

@Component({
  selector: 'app-bill-add',
  templateUrl: './bill-add.component.html',
  styleUrls: ['./bill-add.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class BillAddComponent implements OnInit, OnDestroy {
  public infinity = Infinity
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  public money=0;
  public fee=0;
  public tax=0;
  public deleted=false;
  public averageSalary=0;
  public products: Observable<any[]>;
  public billAddForm: FormGroup;
  public selectMulti: Observable<any[]>;
  // public selectMultiGroupSelected = [{name: 'Karyn Wright'}];
  public selectMultiGroupSelected = [];
  public selectGainer;
  public selectBuyer;
  // Public
  public url = this.router.url;
  public urlLastValue;
  public apiData;
  public sidebarToggleRef = false;
  public paymentSidebarToggle = false;
  public items = [{itemId: '', itemName: '', itemQuantity: '', itemCost: ''}];

  public item = {
    itemName: '',
    itemQuantity: '',
    itemCost: ''
  };

  // Ng2-Flatpickr Options
  public DateRangeOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    // defaultDate: ['2020-05-01'],
    altFormat: 'Y-n-j H:i',
    enableTime: true,
    dateFormat: "Y-m-d H:i"
  };

  public paymentDetails = {
    totalDue: '$12,110.55',
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213874685',
    swiftCode: 'BR91905'
  };

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {InvoiceEditService} _invoiceEditService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
      private router: Router,
      private _invoiceEditService: BillAddService,
      private _coreSidebarService: CoreSidebarService,
      private _dataService: DataService,
      private productService: ProductService
  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/', this.url.length));
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add Item
   */
  addItem() {
    this.items.push({
      itemId: '',
      itemName: '',
      itemQuantity: '',
      itemCost: ''
    });
  }

  /**
   * DeleteItem
   *
   * @param id
   */
  deleteItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
        this.items.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._invoiceEditService.onBillEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.apiData = response;
    });
    this.initForm();
    this.products = this.productService.getProductList();
    this.selectMulti = this._dataService.getMembers();
    // this.selectMultiGroupSelected = this.apiData.members;
    // this.selectGainer = this.apiData.gainer;
    // this.selectBuyer = this.apiData.buyer;
    // this.averageSalary = ((this.money - this.fee) * (1 - this.tax / 100)) / this.selectMultiGroupSelected.length
    this.subscription = this.modelChanged
        .pipe(
            debounceTime(500),
        )
        .subscribe((value) => {
          this.functionToBeCalled();
        });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  private initForm() {
    this.billAddForm = new FormGroup({
      'productName': new FormControl(),
      'billId': new FormControl(),
      'gainTime': new FormControl(),
      'transactionTime': new FormControl(),
      'gainer': new FormControl(),
      'buyer': new FormControl(),
      'money': new FormControl(),
      'way': new FormControl(),
      'status': new FormControl(),
      'tax': new FormControl(),
      'fee': new FormControl(),
      'members': new FormControl(),
      'deleted': new FormControl()
    });
  }

  functionToBeCalled() {
    this.averageSalary = ((this.money - this.fee) * (1 - this.tax / 100)) / this.selectMultiGroupSelected.length
  }

  inputChanged(value: any) {
    this.modelChanged.next(value)
  }

  onSubmit() {
    this._invoiceEditService.createBill(this.billAddForm.value);
    this.router.navigate(['/bills']).then(() => {
      window.location.reload();
    });;
  }
}
