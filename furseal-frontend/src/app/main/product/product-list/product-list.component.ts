import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CoreTranslationService} from '../../../../@core/services/translation.service';
import {Product} from '../product.model';
import {Subject, Subscription} from 'rxjs';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ProductListService} from './product-list.service';
import * as snippet from 'app/main/product/product-list/product-list.snippetcode';
import {locale as german} from 'app/main/product/product-list/i18n/de';
import {locale as english} from 'app/main/product/product-list/i18n/en';
import {locale as french} from 'app/main/product/product-list/i18n/fr';
import {locale as portuguese} from 'app/main/product/product-list/i18n/pt';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProductListComponent implements OnInit {
    products: Product[] = [];

    // Private
    private _unsubscribeAll: Subject<any>;
    private tempData = [];

    // public
    public contentHeader: object;
    public rows: any;
    public selected = [];
    public kitchenSinkRows: any;
    public selectedOption: number = 10;
    public ColumnMode = ColumnMode;
    public expanded = {};
    public editingName = {};
    public editingStatus = {};
    public editingAge = {};
    public editingSalary = {};
    public chkBoxSelected = [];
    public SelectionType = SelectionType;
    public exportCSVData;
    public previousStatusFilter = '';
    public tempFilterData;

    @ViewChild(DatatableComponent) table: DatatableComponent;
    @ViewChild('tableRowDetails') tableRowDetails: any;


    // snippet code variables
    public _snippetCodeKitchenSink = snippet.snippetCodeKitchenSink;
    public _snippetCodeInlineEditing = snippet.snippetCodeInlineEditing;
    public _snippetCodeRowDetails = snippet.snippetCodeRowDetails;
    public _snippetCodeCustomCheckbox = snippet.snippetCodeCustomCheckbox;
    public _snippetCodeResponsive = snippet.snippetCodeResponsive;
    public _snippetCodeMultilangual = snippet.snippetCodeMultilangual;


    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Inline editing Name
     *
     * @param event
     * @param cell
     * @param rowIndex
     */
    inlineEditingUpdateName(event, cell, rowIndex) {
        this.editingName[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = event.target.value;
        this.rows = [...this.rows];
    }

    /**
     * Inline editing Age
     *
     * @param event
     * @param cell
     * @param rowIndex
     */
    inlineEditingUpdateAge(event, cell, rowIndex) {
        this.editingAge[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = event.target.value;
        this.rows = [...this.rows];
    }

    /**
     * Inline editing Salary
     *
     * @param event
     * @param cell
     * @param rowIndex
     */
    inlineEditingUpdateSalary(event, cell, rowIndex) {
        this.editingSalary[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = event.target.value;
        this.rows = [...this.rows];
    }

    /**
     * Inline editing Status
     *
     * @param event
     * @param cell
     * @param rowIndex
     */
    inlineEditingUpdateStatus(event, cell, rowIndex) {
        this.editingStatus[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = event.target.value;
        this.rows = [...this.rows];
    }

    /**
     * Search (filter)
     *
     * @param event
     */
    filterByProductName(event) {
        let filter = event.target.value;
        console.log(`filter: ${filter}`);
        this.previousStatusFilter = filter;
        filter = filter.toLowerCase();
        this.tempFilterData = this.tempData.filter(row => {
            const isPartialNameMatch = row.productName.toLowerCase().indexOf(filter) !== -1 || !filter;
            return isPartialNameMatch;
        });
        this.rows = this.tempFilterData;
    }

    /**
     * Row Details Toggle
     *
     * @param row
     */
    rowDetailsToggleExpand(row) {
        this.tableRowDetails.rowDetail.toggleExpandRow(row);
    }

    /**
     * For ref only, log selected values
     *
     * @param selected
     */
    onSelect({selected}) {
        console.log('Select Event', selected, this.selected);

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    /**
     * For ref only, log activate events
     *
     * @param selected
     */
    onActivate(event) {
        // console.log('Activate Event', event);
    }

    /**
     * Custom Chkbox On Select
     *
     * @param { selected }
     */
    customChkboxOnSelect({selected}) {
        this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
        this.chkBoxSelected.push(...selected);
    }

    /**
     * Constructor
     *
     * @param {BillListService} _datatablesService
     * @param {CoreTranslationService} _coreTranslationService
     */
    constructor(private productListService: ProductListService, private _coreTranslationService: CoreTranslationService, private route: ActivatedRoute,
                private router: Router) {
        this._unsubscribeAll = new Subject();
        this._coreTranslationService.translate(english, french, german, portuguese);
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------


    /**
     * On init
     */
    ngOnInit() {
        // content header
        this.contentHeader = {
            headerTitle: 'Product',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Home',
                        isLink: true,
                        link: '/'
                    },
                    {
                        name: 'Product',
                        isLink: false
                    }
                ]
            }
        };

        this.productListService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            console.log(response);
            this.rows = response;
            this.tempData = this.rows;
            this.kitchenSinkRows = this.rows;
            this.exportCSVData = this.rows;
        });

    }
    onFetchData() {
        this.productListService.fetchProductOrders();
    }

    // onBillDetail(billId:number) {
    //     console.log('aaaa');
    //     console.log(billId);
    //     // this.router.navigate(['edit'], {relativeTo: this.route});
    //     // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
    // }
    deleteBill(billId: number) {
        this.productListService.deleteDataTableRows(billId);
    }

    addNewBill() {
        // this.router.navigate(['/add/1']);
        this.router.navigate(['add/1'], {relativeTo: this.route});
    }




    // getStatusClass(status: string): string {
    //     if (status == 'Active') {
    //         return 'badge-light-primary';
    //     } else if (status == 'Completed') {
    //         return 'badge-light-success'
    //     } else if (status == 'Scheduled') {
    //         return 'badge-light-info'
    //     } else if (status == 'Pending') {
    //         return 'badge-light-warning'
    //     }
    // }
    //
    // onFetchData() {
    //     this.dataStorageService.fetchProducts();
    // }

}
