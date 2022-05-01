import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from './product.model';
import {ProductService} from './product.service';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    private readonly backendUrl = '/api/products';

    constructor(private http: HttpClient, private productService: ProductService) {
    }

    storeProduct(product: Product) {
        this.http
            .put(this.backendUrl,
                product
            )
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchProducts() {
        this.http
            .get<Product[]>(
                this.backendUrl
            ).subscribe(products => {
            this.productService.setProducts(products);
        });
    }
}
