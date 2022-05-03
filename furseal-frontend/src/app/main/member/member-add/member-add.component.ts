import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {repeaterAnimation} from 'app/main//bill/bill.animation';
import {FormControl, FormGroup} from '@angular/forms';
import {MemberAddService} from './member-add.services';

@Component({
    selector: 'app-member-add',
    templateUrl: './member-add.component.html',
    styleUrls: ['./member-add.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class MemberAddComponent implements OnInit, OnDestroy {
    public name="";
    public price=0;
    public infinity = Infinity
    public memberAddForm: FormGroup;
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
        private _invoiceEditService: MemberAddService,
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
        this._invoiceEditService.onMemberEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
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
        this.memberAddForm = new FormGroup({
            'name': new FormControl(),
            'guild': new FormControl(),
        });
    }

    onSubmit() {
        this._invoiceEditService.createMember(this.memberAddForm.value);
        this.router.navigate(['/members']).then(() => {
            window.location.reload();
        });
    }
}
