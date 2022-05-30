import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';

import {CoreTranslationService} from '@core/services/translation.service';

import {locale as german} from 'app/main/bill/bill-list/i18n/de';
import {locale as english} from 'app/main/bill/bill-list/i18n/en';
import {locale as french} from 'app/main/bill/bill-list/i18n/fr';
import {locale as portuguese} from 'app/main/bill/bill-list/i18n/pt';

import * as snippet from 'app/main/bill/bill-list/bill-list.snippetcode';

import {BillListService} from 'app/main/bill/bill-list/bill-list.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Bill} from '../../bill/bill.model';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Member} from '../../member/member.model';
import {DataService} from '../../share/data.service';

@Component({
    selector: 'app-bill',
    templateUrl: './salary-detail.component.html',
    styleUrls: ['./salary-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SalaryDetailComponent implements OnInit {
    public url = this.router.url;
    public urlLastValue;
    private fromDateYear: number;
    private fromDateMonth: number;
    private fromDateDay: number;
    private toDateYear: number;
    private toDateMonth: number;
    private toDateDay: number;
    public member: Member;
    public memberNodeal: Member;


    public total: number = 0;
    public fromDate: NgbDate | null;
    public toDate: NgbDate | null;
    public hoveredDate: NgbDate | null = null;

    // Private
    private _unsubscribeAll: Subject<any>;
    private tempData = [];

    // public
    public contentHeader: object;
    public rows: any;
    public rows2: any;
    public selected = [];
    public kitchenSinkRows: any;
    public selectedOption: number = 50;
    public selectedOption2: number = 50;
    public ColumnMode = ColumnMode;
    public expanded = {};
    public editingName = {};
    public editingStatus = {};
    public editingAge = {};
    public editingSalary = {};
    public chkBoxSelected = [];
    public SelectionType = SelectionType;
    public exportCSVData;
    public bills: Bill[] = [];
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
    constructor(private _dataService: DataService, private _coreTranslationService: CoreTranslationService, private route: ActivatedRoute,
                private router: Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
        this._unsubscribeAll = new Subject();
        this._coreTranslationService.translate(english, french, german, portuguese);
        this.urlLastValue = this.url.substr(this.url.lastIndexOf('/', this.url.length));
        this.urlLastValue = this.urlLastValue.substr(1, this.urlLastValue.indexOf('?')-1);
    }


    /**
     * On init
     */
    ngOnInit() {
        // content header
        this.contentHeader = {
            headerTitle: 'Salaries',
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
                        name: 'Salaries',
                        isLink: true,
                        link: '/salaries'
                    },
                    {
                        name: 'Member',
                        isLink: false
                    }
                ]
            }
        };

        this.route.queryParams.subscribe(params => {
            this.fromDateYear = params['fromDateYear'];
            this.fromDateMonth = params['fromDateMonth'];
            this.fromDateDay = params['fromDateDay'];
            this.toDateYear = params['toDateYear'];
            this.toDateMonth = params['toDateMonth'];
            this.toDateDay = params['toDateDay'];
            this.route.url

            this._dataService.querySalary(this.urlLastValue, this.fromDateYear, this.fromDateMonth, this.fromDateDay, this.toDateYear, this.toDateMonth, this.toDateDay).subscribe((response) => {
                this.member = response;
                this.rows=this.member.bills
            }),
                (error) => {                              //error() callback
                    console.log(error)
                },
                () => {                                   //complete() callback
                    console.error('Request completed')      //This is actually not needed
                };

            this._dataService.querySalaryNoDeal(this.urlLastValue, this.fromDateYear, this.fromDateMonth, this.fromDateDay, this.toDateYear, this.toDateMonth, this.toDateDay).subscribe((response) => {
                this.memberNodeal = response;
                this.rows2=this.memberNodeal.bills
            }),
                (error) => {                              //error() callback
                    console.log(error)
                },
                () => {                                   //complete() callback
                    console.error('Request completed')      //This is actually not needed
                };
        });
    }
}
