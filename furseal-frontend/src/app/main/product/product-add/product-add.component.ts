import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {repeaterAnimation} from 'app/main//bill/bill.animation';
import {FormControl, FormGroup} from '@angular/forms';
import {ProductAddService} from './product-add.services';
import {ProductService} from '../product.service';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class ProductAddComponent implements OnInit, OnDestroy {
    public name="";
    public price=0;
    public infinity = Infinity
    public products: Observable<any[]>;
    public productAddForm: FormGroup;
    public selectMulti: Observable<any[]>;
    public selectMultiGroupSelected = [];
    // Public
    public url = this.router.url;
    public urlLastValue;
    public apiData;
    public sidebarToggleRef = false;
    public paymentSidebarToggle = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _invoiceEditService: ProductAddService,
        private _coreSidebarService: CoreSidebarService,
    ) {
        this._unsubscribeAll = new Subject();
        this.urlLastValue = this.url.substr(this.url.lastIndexOf('/', this.url.length));
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

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
        this._invoiceEditService.onProductEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.apiData = response;
        });
        this.initForm();
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
        this.productAddForm = new FormGroup({
            'level': new FormControl(),
            'name': new FormControl(),
        });
    }

    onSubmit() {
        this._invoiceEditService.createProduct(this.productAddForm.value);
        this.router.navigate(['/products']).then(() => {
            window.location.reload();
        });
    }
}
