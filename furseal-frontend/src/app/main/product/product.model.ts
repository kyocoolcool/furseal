export class Product {
    public productId: number;
    public name: string;
    public price: number;

    constructor(productId: number, name: string, price: number) {
        this.productId = productId;
        this.name = name;
        this.price = price;
    }
}
