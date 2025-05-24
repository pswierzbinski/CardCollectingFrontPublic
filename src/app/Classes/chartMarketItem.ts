export interface IChartMarketItem {
    dateClosed: Date;
    price: number;
    quantity: number;

}

export class chartMarketItem {
    private _dateClosed: Date;
    private _price: number;
    private _quantity: number;
    constructor(dateClosed: Date, price: number, quantity: number) {
        this._dateClosed = dateClosed;
        this._price = price;
        this._quantity = quantity;
    }

    get dateClosed(): Date {
        return this._dateClosed;
    }
    get price(): number {
        return this._price;
    }
    get quantity(): number {
        return this._quantity;
    }
    set dateClosed(dateClosed: Date) {
        this._dateClosed = dateClosed;
    }
    set price(price: number) {
        this._price = price;
    }
    set quantity(quantity: number) {
        this._quantity = quantity;
    }
}