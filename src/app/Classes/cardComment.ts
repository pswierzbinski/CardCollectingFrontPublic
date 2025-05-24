export interface ICardComment {
    id: number;
    comment: string;
    date: Date;
    cardId: number;
    userId: string;
    userName: string;
}

export class CardComment {
    private _id: number;
    private _comment: string;
    private _date: Date;
    private _cardId: number;
    private _userId: string;
    private _userName: string;

    constructor(id: number, comment: string, date: Date, cardId: number, userId: string, userName: string) {
        this._id = id;
        this._comment = comment;
        this._date = date;
        this._cardId = cardId;
        this._userId = userId;
        this._userName = userName;
    }

    get id(): number {
        return this._id;
    }

    get comment(): string {
        return this._comment;
    }

    get date(): Date {
        return this._date;
    }

    get cardId(): number {
        return this._cardId;
    }

    get userId(): string {
        return this._userId;
    }

    get userName(): string {
        return this._userName
    }

    set id(id: number) {
        this._id = id;
    }

    set comment(comment: string) {
        this._comment = comment;
    }

    set date(date: Date) {
        this._date = date;
    }

    set cardId(CardId: number) {
        this._cardId = CardId;
    }

    set userId(userId: string) {
        this._userId = userId;
    }

    set userName(userName: string) {
        this._userName = userName;
    }
}