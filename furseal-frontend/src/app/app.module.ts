import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import 'hammerjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {ToastrModule} from 'ngx-toastr'; // For auth after login toast

import {CoreModule} from '@core/core.module';
import {CoreCommonModule} from '@core/common.module';
import {CoreSidebarModule, CoreThemeCustomizerModule} from '@core/components';

import {coreConfig} from 'app/app-config';

import {AppComponent} from 'app/app.component';
import {LayoutModule} from 'app/layout/layout.module';
import {ProductModule} from './main/product/product.module';
import {BillModule} from './main/bill/bill.module';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {FakeDbService} from '../@fake-db/fake-db.service';
import {SalaryModule} from './main/salary/salary.module';
import {MemberModule} from './main/member/member.module';
import {HomeModule} from './main/home/home.module';
import {SampleModule} from './main/sample/sample.module';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {ConfigInitService} from './init/config-init.service';
import {initializeKeycloak} from './init/keycloak-init.factory';
import {AuthGuard} from './guard/auth.guard';

const appRoutes: Routes = [
    {
        path: 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
    }
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled', // Add options right here
            relativeLinkResolution: 'legacy'
        }),
        TranslateModule.forRoot(),

        //NgBootstrap
        NgbModule,
        ToastrModule.forRoot(),

        // Core modules
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,

        // App modules
        LayoutModule,
        HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),
        HomeModule,
        SampleModule,
        ProductModule,
        BillModule,
        SalaryModule,
        MemberModule,
        KeycloakAngularModule
    ],
    providers: [
        ConfigInitService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService, ConfigInitService],
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
