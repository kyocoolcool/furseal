import {Component, OnInit} from '@angular/core';
import {CoreTranslationService} from '../../../../@core/services/translation.service';
import {locale as en} from '../i18n/en';
import {locale as fr} from '../i18n/fr';
import {locale as de} from '../i18n/de';
import {locale as pt} from '../i18n/pt';
import {HttpClient} from '@angular/common/http';
import {Product} from '../product.model';
import {ProductService} from '../product.service';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../data-storage.service';

@Component({
    selector: 'app-product-test',
    templateUrl: './product-test.component.html',
    styleUrls: ['./product-test.component.scss']
})

export class ProductTestComponent implements OnInit {
    public contentHeader: object
    products: Product[] = [];
    subscription: Subscription;

    /**
     *
     * @param {CoreTranslationService} _coreTranslationService
     */
    constructor(private _coreTranslationService: CoreTranslationService, private httpClient: HttpClient, private dataStorageService: DataStorageService, private productService: ProductService) {
        this._coreTranslationService.translate(en, fr, de, pt)
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {

        //read from backend
        this.subscription = this.productService.productsChanged
            .subscribe(
                (products: Product[]) => {
                    this.products = products;
                }
            );
        this.products = this.productService.getProducts();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
