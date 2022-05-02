import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ProductListComponent } from './product-list/product-list.component';
import {HttpClientModule} from '@angular/common/http';
import {ProductTestComponent} from './product-test/product-test.component';
import {SampleComponent} from './sample.component';
import {HomeComponent} from './home.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CardSnippetModule} from '../../../@core/components/card-snippet/card-snippet.module';
import {BillListService} from '../bill/bill-list/bill-list.service';
import {ProductService} from './product.service';
import {ProductListService} from './product-list/product-list.service';
import {ProductAddService} from './product-add/product-add.services';
import {ProductAddComponent} from './product-add/product-add.component';
import {BillAddComponent} from '../bill/bill-add/bill-add.component';
import {BillAddService} from '../bill/bill-add/bill-add.services';
import {CommonModule} from '@angular/common';
import {CoreDirectivesModule} from '../../../@core/directives/directives';
import {CorePipesModule} from '../../../@core/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {CsvModule} from '@ctrl/ngx-csv';
import {CoreSidebarModule} from '../../../@core/components';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {NgSelectModule} from '@ng-select/ng-select';
import {BillEditComponent} from '../bill/bill-edit/bill-edit.component';
import {BillEditService} from '../bill/bill-edit/bill-edit.service';
import {ProductEditService} from './product-edit/product-edit.services';
import {ProductEditComponent} from './product-edit/product-edit.component';

const routes = [
  {
    path: 'sample',
    component: SampleComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  },
  {
    path: 'products',
    component: ProductListComponent,
    resolve: {
      data: ProductListService
    },
    data: { animation: 'product' }
  },
  {
    path: 'products/edit/:id',
    component: ProductEditComponent,
    resolve: {
      data: ProductEditService
    }
  },
  {
    path: 'products/add',
    component: ProductAddComponent,
    resolve: {
      data: ProductAddService
    }
  },
  {
    path: 'products/add/:id',
    component: ProductAddComponent,
    resolve: {
      data: ProductAddService
    }
  }
];

@NgModule({
  declarations: [HomeComponent, ProductListComponent, ProductAddComponent,ProductEditComponent, ProductTestComponent, SampleComponent],
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
  providers: [ProductListService,ProductAddService,ProductEditService]
})
export class ProductModule { }
