export interface IMarketUserRespsonse {
    id: number;
    cardName: string;
    price: number;
    quantity: number;
    sellOrder: boolean;
}

export class MarketUserRespsonse {
    private _id: number;
    private _cardName: string;
    private _price: number;
    private _quantity: number;
    private _sellOrder: boolean;

    constructor(id: number, cardName: string, price: number, quantity: number, sellOrder: boolean) {
        this._id = id;
        this._price = price;
        this._quantity = quantity;
        this._sellOrder = sellOrder;
        this._cardName = cardName;
    }

    get id(): number {
        return this._id;
    }

    get cardName(): string {
        return this._cardName;
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

    set id(id: number) {
        this._id = id;
    }

    set cardName(cardName: string) {
        this._cardName = cardName;
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