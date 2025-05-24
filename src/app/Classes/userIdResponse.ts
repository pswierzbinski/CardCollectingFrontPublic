export interface IUserIdResponse {
    id: string;
}

export class UserIdResponse {
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    public get id(): string {
        return this._id;
    }

    public set id(id: string) {
        this._id = id;
    }
}