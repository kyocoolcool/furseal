import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {HomeComponent} from './home.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CardSnippetModule} from '../../../@core/components/card-snippet/card-snippet.module';
import {CommonModule} from '@angular/common';
import {CoreDirectivesModule} from '../../../@core/directives/directives';
import {CorePipesModule} from '../../../@core/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {CsvModule} from '@ctrl/ngx-csv';
import {CoreSidebarModule} from '../../../@core/components';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {NgSelectModule} from '@ng-select/ng-select';
import {AuthGuard} from '../../guard/auth.guard';

const routes = [
  {
    path: 'home',canActivate: [AuthGuard],
    component: HomeComponent,
    data: { animation: 'home'}
  }
];

@NgModule({
  declarations: [HomeComponent],
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
  exports: [],
  providers: []
})
export class HomeModule { }
