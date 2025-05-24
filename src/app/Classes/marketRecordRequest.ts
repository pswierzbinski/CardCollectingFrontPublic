export interface IMarketRecordRequest {
    cardId: number;
    price: number;
    quantity: number;
    sellOrder: boolean;
}


export class MarketRecordRequest {
    private _cardId: number;
    private _price: number;
    private _quantity: number;
    private _sellOrder: boolean;
    constructor(cardId: number, price: number, quantity: number, sellOrder: boolean) {
        this._cardId = cardId;
        this._price = price;
        this._quantity = quantity;
        this._sellOrder = sellOrder;
    }

    get cardId(): number {
        return this._cardId;
    }

    get price(): number {
        return this._price;
    }

    get quantity(): number {
        return this._quantity;
    }

    get sellOrder(): boolean {
        return this._sellOrder;
    }

    set cardId(cardId: number) {
        this._cardId = cardId;
    }

    set price(price: number) {
        this._price = price;
    }

    set quantity(quantity: number) {
        this._quantity = quantity;
    }

    set sellOrder(sellOrder: boolean) {
        this._sellOrder = sellOrder;
    }
}