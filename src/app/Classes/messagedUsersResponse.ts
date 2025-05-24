export interface IMessagedUsers {
    userId: string;
    userName: string;
}

export class MessagedUsers {
    private _userId: string;
    private _userName: string;

    constructor(userId: string, userName: string) {
        this._userId = userId;
        this._userName = userName;
    }

    public get userId(): string {
        return this._userId;
    }

    public get userName(): string {
        return this._userName;
    }

    public set userId(userId: string) {
        this._userId = userId;
    }

    public set userName(userName: string) {
        this._userName = userName;
    }
}