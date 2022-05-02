import {Bill} from '../bill/bill.model';

export class Member {
    public memberId: number;
    public name: string;
    public salary: number;
    public guild: string;
    public bills: Bill[]
    constructor(memberId: number, name: string, salary: number, guild: string, bills: Bill[]) {
        this.memberId = memberId;
        this.name = name;
        this.salary = salary;
        this.guild = guild;
        this.bills = bills;
    }
}
