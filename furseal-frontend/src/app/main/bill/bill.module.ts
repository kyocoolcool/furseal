import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CsvModule} from '@ctrl/ngx-csv';
import {TranslateModule} from '@ngx-translate/core';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {CoreCommonModule} from '@core/common.module';
import {CardSnippetModule} from '@core/components/card-snippet/card-snippet.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';

import {BillListComponent} from 'app/main/bill/bill-list/bill-list.component';
import {BillListService} from 'app/main/bill/bill-list/bill-list.service';
import {BillDetailComponent} from './bill-detail/bill-detail.component';
import {CoreSidebarModule} from '../../../@core/components';
import {
    SendInvoiceSidebarPreviewComponent
} from './bill-detail/sidebar/send-invoice-sidebar-preview/send-invoice-sidebar-preview.component';
import {
    AddPaymentSidebarPreviewComponent
} from './bill-detail/sidebar/add-payment-sidebar-preview/add-payment-sidebar-preview.component';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {CommonModule} from '@angular/common';
import {CoreDirectivesModule} from '../../../@core/directives/directives';
import {NgSelectModule} from '@ng-select/ng-select';
import {CorePipesModule} from '../../../@core/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {BillEditComponent} from './bill-edit/bill-edit.component';
import {BillEditService} from './bill-edit/bill-edit.service';
import {BillAddComponent} from './bill-add/bill-add.component';
import {BillAddService} from './bill-add/bill-add.services';
import {AuthGuard} from '../../guard/auth.guard';
import {ProductAddComponent} from '../product/product-add/product-add.component';
import {ProductAddService} from '../product/product-add/product-add.services';


const routes: Routes = [
    {
        path: 'bills',
        component: BillListComponent, canActivate: [AuthGuard],
        resolve: {
            bill: BillListService
        },
        data: {animation: 'bill'}
    },
    {
        path: 'bills/:id',
        component: BillDetailComponent, canActivate: [AuthGuard],
        resolve: {
            data: BillEditService
        },
        data: {path: 'user-view/:id', animation: 'InvoicePreviewComponent'}
    },
    {
        path: 'bills/edit/:id', canActivate: [AuthGuard],
        component: BillEditComponent,
        resolve: {
            data: BillEditService
        },
        data: {roles: ['ADMIN']}
    },
    {
        path: 'bills/add',
        component: BillAddComponent, canActivate: [AuthGuard],
        resolve: {
            data: BillAddService
        },
        data: {roles: ['ADMIN']}
    },
    {
        path: 'bills/add/:id', canActivate: [AuthGuard],
        component: BillAddComponent,
        pathMatch: 'full',
        resolve: {
            data: BillAddService
        },
        data: {roles: ['ADMIN']}
    }
];

@NgModule({
    declarations: [BillListComponent,
        BillDetailComponent,
        BillEditComponent,
        // AddCustomerSidebarComponent,
        // SendInvoiceSidebarComponent,
        // AddPaymentSidebarComponent,
        SendInvoiceSidebarPreviewComponent,
        AddPaymentSidebarPreviewComponent,
        BillAddComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        TranslateModule,
        CoreCommonModule,
        CoreDirectivesModule,
        ContentHeaderModule,
        CardSnippetModule,
        NgxDatatableModule,
        CorePipesModule,
        FormsModule,
        CsvModule,
        CoreSidebarModule,
        Ng2FlatpickrModule,
        NgSelectModule,
    ],
    providers: [BillListService, BillEditService, BillAddService]
})
export class BillModule {
}
