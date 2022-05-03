import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Product} from './product.model';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Member} from '../member/member.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly backendUrl = '/api/products';
    productsChanged = new Subject<Product[]>();
    private products: Product[] = [];
    constructor(private http: HttpClient) {
    }

    setProducts(products: Product[]) {
        this.products = products;
        console.log(products);
        this.productsChanged.next(this.products.slice());
    }

    getProducts() {
        return this.products.slice();
    }

    addProduct(product: Product) {
        this.products.push(product);
        this.productsChanged.next(this.products.slice());
    }

    getProductList():Observable<Product[]> {
        return this.http.get<Product[]>(this.backendUrl);
    }

    getProductLevel():Observable<String[]> {
        return this.http.get<String[]>(`${this.backendUrl}/level`);
    }
}
