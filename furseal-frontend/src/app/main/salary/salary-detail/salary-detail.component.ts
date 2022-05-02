import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Calendar} from '@fullcalendar/angular';
import {NgbDateStructAdapter} from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DataService} from '../../share/data.service';
import {Member} from '../../member/member.model';
import {Bill} from '../../bill/bill.model';

@Component({
    selector: 'app-salary-detail',
    templateUrl: './salary-detail.component.html',
    styleUrls: ['./salary-detail.component.scss']
})
export class SalaryDetailComponent implements OnInit {
    public url = this.router.url;
    public urlLastValue;
    public contentHeader: object
    private fromDateYear: number;
    private fromDateMonth: number;
    private fromDateDay: number;
    private toDateYear: number;
    private toDateMonth: number;
    private toDateDay: number;
    public selectMulti: Observable<any>;
    public member: Member;
    public billsByMember: Observable<Member>;


    constructor(private router: Router, private route: ActivatedRoute, private _dataService: DataService,) {
        this.urlLastValue = this.url.substr(this.url.lastIndexOf('/', this.url.length));
        this.urlLastValue = this.urlLastValue.substr(1, this.urlLastValue.indexOf('?')-1);
    }

    ngOnInit() {
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
        }


        this.route.queryParams.subscribe(params => {
            this.fromDateYear = params['fromDateYear'];
            this.fromDateMonth = params['fromDateMonth'];
            this.fromDateDay = params['fromDateDay'];
            this.toDateYear = params['toDateYear'];
            this.toDateMonth = params['toDateMonth'];
            this.toDateDay = params['toDateDay'];
            this.route.url

            this._dataService.querySalary(this.urlLastValue, this.fromDateYear, this.fromDateMonth, this.fromDateDay, this.toDateYear, this.toDateMonth, this.toDateDay).subscribe((response) => {
                console.log(response);
                this.member = response;
            }),
                (error) => {                              //error() callback
                    console.log(error)
                },
                () => {                                   //complete() callback
                    console.error('Request completed')      //This is actually not needed
                };


            // this.billsByMember = this._dataService.getBillsByMember(1);
            // console.log(this.billsByMember);


        });
    }
}
