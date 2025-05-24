export interface IUser {
    id: string;
    username: string;
    email: string;
    creationDate: Date;
}

export class User {
    private _id: string;
    private _username: string;
    private _email: string;
    private _creationDate: Date;

    constructor(id: string, username: string, email: string, creationDate: Date) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._creationDate = creationDate;
    }

    get username(): string {
        return this._username;
    }

    get email(): string {
        return this._email;
    }

    get Id(): string {
        return this._id;
    }
    get creationDate(): Date {
        return this._creationDate;
    }
    set username(username: string) {
        this._username = username;
    }

    set email(email: string) {
        this._email = email;
    }

    set Id(id: string) {
        this._id = id;
    }

    set creationDate(creationDate: Date) {
        this._creationDate = creationDate;
    }
}