import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {CoreSidebarModule} from '../../../@core/components';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {CommonModule} from '@angular/common';
import {CoreDirectivesModule} from '../../../@core/directives/directives';
import {NgSelectModule} from '@ng-select/ng-select';
import {CorePipesModule} from '../../../@core/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {SalaryListComponent} from './salary-list/salary-list.component';
import {SalaryListService} from './salary-list/salary-list.service';
import { SalaryDetailComponent } from './salary-detail/salary-detail.component';
import {SalaryTaxComponent} from './salary-tax/salary-tax.component';
import {SalaryTaxService} from './salary-tax/salary-tax.service';


const routes: Routes = [
    {
        path: 'salaries',
        component: SalaryListComponent,
        resolve: {
            data: SalaryListService
        },
        data: { name: 'salary' }
    },
    {
        path: 'salaries/tax',
        component: SalaryTaxComponent,
        resolve: {
            data: SalaryTaxService
        },
        data: { name: 'salaryTax' }
    },
    {
        path: 'salaries/:id',
        component: SalaryDetailComponent
    }


];

@NgModule({
    declarations: [
        SalaryListComponent,
        SalaryDetailComponent,
        SalaryTaxComponent
        ],
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
        NgSelectModule
    ],
    providers: [SalaryListService,SalaryTaxService]
})
export class SalaryModule {}
