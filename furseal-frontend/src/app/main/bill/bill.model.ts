export class Bill {
    public billId: number;
    public productName: string;
    public money: number;
    public averageSalary: number;
    public memberCount: number;
    public gainer: string;
    public buyer: string;
    public way: number;
    public status: number;
    public gainTime: string;
    public transactionTime: string;
    public deleted: boolean;


    constructor(billId: number, productName: string, money: number, averageSalary: number, memberCount: number, gainer: string, buyer: string, way: number, status: number, gainTime: string, transactionTime: string, deleted: boolean) {
        this.billId = billId;
        this.productName = productName;
        this.money = money;
        this.averageSalary = averageSalary;
        this.memberCount = memberCount;
        this.gainer = gainer;
        this.buyer = buyer;
        this.way = way;
        this.status = status;
        this.gainTime = gainTime;
        this.transactionTime = transactionTime;
        this.deleted = deleted;
    }
}
