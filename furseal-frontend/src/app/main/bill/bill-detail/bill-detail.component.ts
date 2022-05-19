import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {repeaterAnimation} from '../bill.animation';
import {BillEditService} from '../bill-edit/bill-edit.service';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../../../environments/environment';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-bill-detail',
    templateUrl: './bill-detail.component.html',
    styleUrls: ['./bill-detail.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class BillDetailComponent implements OnInit, OnDestroy {
    public imageUrl: any = environment.imageUrl;
    roles: string[];
    infinity = Infinity
    // Public
    public url = this.router.url;
    public urlLastValue;
    public apiData;
    public sidebarToggleRef = false;
    public paymentSidebarToggle = false;
    public items = [{itemId: '', itemName: '', itemQuantity: '', itemCost: ''}];
    public averageSalary;

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
        defaultDate: ['2020-05-01'],
        altFormat: 'Y-n-j'
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
        private keycloakService: KeycloakService,
        private modalService: NgbModal
    ) {
        this._unsubscribeAll = new Subject();
        console.log(`this url ${this.url.lastIndexOf('/') + 1}`);
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
        console.log(this.apiData);
        this.averageSalary = ((this.apiData.money - this.apiData.fee) * (1 - this.apiData.tax / 100)) / this.apiData.members.length;
        this.roles = this.keycloakService.getUserRoles();
        this.imageUrl += this.urlLastValue + '?random=' + Math.random();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    haveAdmin(): boolean {
        return !(this.roles.indexOf('ADMIN') > -1);
    }

    withAutofocus = `<button type="button" ngbAutofocus class="btn btn-danger"
      (click)="modal.close('Ok click')">關閉</button>`;


    open() {
        const modalRef = this.modalService.open(NgbdModalContent, { windowClass: 'my-class'});
        modalRef.componentInstance.name = ' 打寶照片';
        modalRef.componentInstance.imageUrl = this.imageUrl;
    }
}

@Component({
    selector: 'ngbd-modal-content',
    template: `
<!--    <div class="modal-header">-->
<!--      <h4 class="modal-title">Hi there!</h4>-->
<!--      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>-->
<!--    </div>-->
    <div class="modal-body">
      <p>{{name}}</p>
        <img class="card-img-top"  [src]=imageUrl />
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
    @Input() name;
    @Input() imageUrl;

    constructor(public activeModal: NgbActiveModal) {}
}


