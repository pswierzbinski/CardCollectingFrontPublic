export interface IMarketRecord {
    id: number;
    cardId: number;
    userId: string;
    userName: string;
    price: number;
    quantity: number;
    isSold: boolean;
    sellOrder: boolean;
    datePlaced: Date;
    dateClosed: Date;
}

export class MarketRecord {
    private _id: number;
    private _cardId: number;
    private _userId: string;
    private _userName: string;
    private _price: number;
    private _quantity: number;
    private _isSold: boolean;
    private _sellOrder: boolean;
    private _datePlaced: Date;
    private _dateClosed: Date;

    constructor(id: number, cardId: number, userId: string, userName: string, price: number, quantity: number, isSold: boolean, sellOrder: boolean, datePlaced: Date, dateClosed: Date) {
        this._id = id;
        this._cardId = cardId;
        this._userId = userId;
        this._userName = userName;
        this._price = price;
        this._quantity = quantity;
        this._isSold = isSold;
        this._sellOrder = sellOrder;
        this._datePlaced = datePlaced;
        this._dateClosed = dateClosed;
    }

    get id(): number {
        return this._id;
    }

    get cardId(): number {
        return this._cardId;
    }

    get userId(): string {
        return this._userId;
    }

    get userName(): string {
        return this._userName;
    }

    get price(): number {
        return this._price;
    }

    get quantity(): number {
        return this._quantity;
    }

    get isSold(): boolean {
        return this._isSold;
    }

    get sellOrder(): boolean {
        return this._sellOrder;
    }

    get datePlaced(): Date {
        return this._datePlaced;
    }

    get dateClosed(): Date {
        return this._dateClosed;
    }

    set id(id: number) {
        this._id = id;
    }

    set cardId(cardId: number) {
        this._cardId = cardId;
    }

    set userId(userId: string) {
        this._userId = userId;
    }

    set userName(userName: string) {
        this._userName = userName
    }

    set price(price: number) {
        this._price = price;
    }

    set quantity(quantity: number) {
        this._quantity = quantity;
    }

    set isSold(isSold: boolean) {
        this._isSold = isSold;
    }

    set sellOrder(sellOrder: boolean) {
        this._sellOrder = sellOrder;
    }

    set datePlaced(datePlaced: Date) {
        this._datePlaced = datePlaced;
    }

    set dateClosed(dateClosed: Date) {
        this._dateClosed = dateClosed;
    }
}