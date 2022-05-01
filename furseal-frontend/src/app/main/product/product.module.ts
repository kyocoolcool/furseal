import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ProductListComponent } from './product-list/product-list.component';
import {HttpClientModule} from '@angular/common/http';
import { ProductAddComponent } from './product-add/product-add.component';
import {ProductTestComponent} from './product-test/product-test.component';
import {SampleComponent} from './sample.component';
import {HomeComponent} from './home.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CardSnippetModule} from '../../../@core/components/card-snippet/card-snippet.module';
import {BillListService} from '../bill/bill-list/bill-list.service';
import {ProductService} from './product.service';
import {ProductListService} from './product-list/product-list.service';

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
    data: { animation: 'products' }
  },
  {
    path: 'products/add',
    component: ProductAddComponent,
    data: { animation: 'add' }
  },
];

@NgModule({
  declarations: [HomeComponent, ProductListComponent, ProductAddComponent, ProductTestComponent, SampleComponent],
  imports: [RouterModule.forChild(routes), NgbModule, ContentHeaderModule, TranslateModule, CoreCommonModule, HttpClientModule,NgxDatatableModule,CardSnippetModule,],
  exports: [ProductListComponent],
  providers: [ProductListService]
})
export class ProductModule { }
