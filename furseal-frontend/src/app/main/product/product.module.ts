import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductTestComponent} from './product-test/product-test.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CardSnippetModule} from '../../../@core/components/card-snippet/card-snippet.module';
import {ProductListService} from './product-list/product-list.service';
import {ProductAddService} from './product-add/product-add.services';
import {ProductAddComponent} from './product-add/product-add.component';
import {CommonModule} from '@angular/common';
import {CoreDirectivesModule} from '../../../@core/directives/directives';
import {CorePipesModule} from '../../../@core/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {CsvModule} from '@ctrl/ngx-csv';
import {CoreSidebarModule} from '../../../@core/components';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {NgSelectModule} from '@ng-select/ng-select';
import {ProductEditService} from './product-edit/product-edit.services';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {AuthGuard} from '../../guard/auth.guard';

const routes = [
    {
        path: 'products',
        component: ProductListComponent, canActivate: [AuthGuard],
        resolve: {
            data: ProductListService
        },
        data: {animation: 'product'}
    },
    {
        path: 'products/edit/:id',
        component: ProductEditComponent, canActivate: [AuthGuard],
        resolve: {
            data: ProductEditService
        },
        data: {roles: ['ADMIN']}
    },
    {
        path: 'products/add',
        component: ProductAddComponent, canActivate: [AuthGuard],
        resolve: {
            data: ProductAddService
        },
        data: {roles: ['ADMIN']}
    },
    {
        path: 'products/add/:id', canActivate: [AuthGuard],
        component: ProductAddComponent,
        resolve: {
            data: ProductAddService
        },
        data: {roles: ['ADMIN']}
    }
];

@NgModule({
    declarations: [ProductListComponent, ProductAddComponent, ProductEditComponent, ProductTestComponent],
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
    exports: [ProductListComponent,],
    providers: [ProductListService, ProductAddService, ProductEditService]
})
export class ProductModule {
}
