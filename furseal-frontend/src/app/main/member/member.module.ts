import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {HttpClientModule} from '@angular/common/http';
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
import {MemberListComponent} from './member-listl/member-list.component';
import {MemberListService} from './member-listl/member-list.service';
import {MemberAddComponent} from './member-add/member-add.component';
import {MemberAddService} from './member-add/member-add.services';
import {MemberEditComponent} from './member-edit/member-edit.component';
import {MemberEditService} from './member-edit/member-edit.services';
import {AuthGuard} from '../../guard/auth.guard';



const routes = [
  {
    path: 'members',
    component: MemberListComponent,canActivate: [AuthGuard],
    resolve: {
      data: MemberListService
    },
    data: { animation: 'member' }
  },
  {
    path: 'members/edit/:id',
    component: MemberEditComponent,canActivate: [AuthGuard],
    resolve: {
      data: MemberEditService
    },
    data: {roles: ['ADMIN']}
  },
  {
    path: 'members/add',
    component: MemberAddComponent,canActivate: [AuthGuard],
    resolve: {
      data: MemberAddService
    },
    data: {roles: ['ADMIN']}
  },
  // {
  //   path: 'products/add/:id',
  //   component: ProductAddComponent,
  //   resolve: {
  //     data: ProductAddService
  //   }
  // }
];

@NgModule({
  declarations: [MemberListComponent,MemberAddComponent,MemberEditComponent],
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
  exports: [MemberListComponent],
  providers: [MemberListService,MemberAddService,MemberEditService]
})
export class MemberModule { }
