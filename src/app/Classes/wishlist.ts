import { Card, ICard } from "./card";

export interface IWishlist {
    wishlistId: number;
    cards: Card[];
    userId: number;
}

export class Wishlist {
    private _wishlistId: number;
    private _cards: Card[];
    private _userId: number;
    constructor(wishlistId: number, cards: Card[], userId: number) {
        this._wishlistId = wishlistId;
        this._cards = cards;
        this._userId = userId;
    }

    get wishlistId(): number {
        return this._wishlistId;
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
    set cards(cards: Card[]) {
        this._cards = cards;
    }
}