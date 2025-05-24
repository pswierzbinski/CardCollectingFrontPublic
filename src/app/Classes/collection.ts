import { Card, ICard } from "./card";

export interface ICollection {
    collectionId: number;
    cards: ICard[];
    userId: number;
    quantity: number[];
}

export class Collection {
    private _collectionId: number;
    private _cards: Card[];
    private _userId: number;
    private _quantity: number[];
    constructor(collectionId: number, cards: Card[], userId: number, quantity: number[]) {
        this._collectionId = collectionId;
        this._cards = cards;
        this._userId = userId;
        this._quantity = quantity;
    }

    get collectionId(): number {
        return this._collectionId;
    }
    get cards(): Card[] {
        return this._cards;
    }
    get userId(): number {
        return this._userId;
    }
    set userId(userId: number) {
        this._userId = userId;
    }
    get quantity(): number[] {
        return this._quantity;
    }
    set quantity(quantity: number[]) {
        this._quantity = quantity;
    }
}