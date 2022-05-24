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
import {BillEditService} from './bill-edit.service';
import {FileUploader} from 'ng2-file-upload';
import {Bill} from '../bill.model';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-bill-edit',
    templateUrl: './bill-edit.component.html',
    styleUrls: ['./bill-edit.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class BillEditComponent implements OnInit, OnDestroy {
    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });
    bill: Bill = new Bill();
    public imageUrl: any = environment.imageUrl;
    private file;
    public infinity = Infinity
    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    public averageSalary;
    public products: Observable<any[]>;
    public billEditForm: FormGroup;
    public selectMulti: Observable<any[]>;
    // public selectMultiGroupSelected = [{name: 'Karyn Wright'}];
    public selectMultiGroupSelected;
    public selectGainer;
    public selectBuyer;
    public selectToMoney;
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
        private _invoiceEditService: BillEditService,
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
            console.log(response);
            this.apiData = response;
        });
        this.initForm();
        this.products = this.productService.getProductList();
        this.selectMulti = this._dataService.getMembers();
        this.selectMultiGroupSelected = this.apiData.members;
        this.selectGainer = this.apiData.gainer;
        this.selectBuyer = this.apiData.buyer;
        this.selectToMoney = this.apiData.toMoney;
        this.averageSalary = ((this.apiData.money - this.apiData.fee) * (1 - this.apiData.tax / 100)) / this.selectMultiGroupSelected.length
        this.subscription = this.modelChanged
            .pipe(
                debounceTime(500),
            )
            .subscribe((value) => {
                this.functionToBeCalled();
            });
        this.imageUrl += this.urlLastValue;
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
        this.billEditForm = new FormGroup({
            'productName': new FormControl(),
            'billId': new FormControl(),
            'gainTime': new FormControl(),
            'transactionTime': new FormControl(),
            'gainer': new FormControl(),
            'buyer': new FormControl(),
            'money': new FormControl(),
            'toMoney': new FormControl(),
            'toMoneyTax': new FormControl(),
            'way': new FormControl(),
            'status': new FormControl(),
            'tax': new FormControl(),
            'fee': new FormControl(),
            'members': new FormControl(),
            'deleted': new FormControl()
        });
    }

    functionToBeCalled() {
        this.averageSalary = ((this.apiData.money - this.apiData.fee) * (1 - this.apiData.tax / 100)) / this.selectMultiGroupSelected.length
    }

    inputChanged(value: any) {
        this.modelChanged.next(value)
    }

    async onSubmit() {
        this.bill.productName = this.billEditForm.get("productName").value;
        this.bill.billId = this.billEditForm.get("billId").value;
        this.bill.gainer = this.billEditForm.get("gainer").value;
        this.bill.buyer = this.billEditForm.get("buyer").value;
        this.bill.money = this.billEditForm.get("money").value;
        this.bill.way = this.billEditForm.get("way").value;
        this.bill.status = this.billEditForm.get("status").value;
        this.bill.tax = this.billEditForm.get("tax").value;
        this.bill.fee = this.billEditForm.get("fee").value;
        this.bill.members = this.billEditForm.get("members").value;
        this.bill.deleted = this.billEditForm.get("deleted").value;
        this.bill.toMoney = this.billEditForm.get("toMoney").value;
        this.bill.toMoneyTax = this.billEditForm.get("toMoneyTax").value;
        let gainTimeStr = this.billEditForm.get("gainTime").value
        let transactionTimeStr = this.billEditForm.get("transactionTime").value;
        let gainTimeDate = new Date(gainTimeStr);
        let transactionTimeDate = new Date(transactionTimeStr);
        this.bill.gainTime = this.addHoursToDate(gainTimeDate, 8);
        if (this.billEditForm.get("transactionTime").value != null) {
            this.bill.transactionTime = this.addHoursToDate(transactionTimeDate,8);
        }
        const formData: FormData = new FormData();
        formData.append('bill', new Blob([JSON.stringify(this.bill)], {
            type: "application/json"
        }));
        formData.append('file', this.file);
        await this._invoiceEditService.updateBill(formData, this.bill.billId);
        this.router.navigate(['/bills']);
    }

    onFileChange(event: any) {
        this.file = event.target.files[0]
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (_event) => {
            this.imageUrl = reader.result;
        }
    }

    addHoursToDate(date: Date, hours: number): Date {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }

}
