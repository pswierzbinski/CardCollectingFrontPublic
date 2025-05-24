export interface IMessage {
    id: number;
    authorId: string;
    authorName: string;
    receiverId: string;
    content: string;
    messageDate: Date;
}

export class Message {
    private _id: number;
    private _authorId: string;
    private _authorName: string;
    private _receiverId: string;
    private _content: string;
    private _messageDate: Date;

    constructor(id: number, authorId: string, authorName: string, receiverId: string, content: string, messageDate: Date = new Date()) {
        this._id = id;
        this._authorId = authorId;
        this._authorName = authorName;
        this._receiverId = receiverId;
        this._content = content;
        this._messageDate = messageDate;
    }

    public get id(): number {
        return this._id;
    }

    public get authorId(): string {
        return this._authorId;
    }

    public get authorName(): string {
        return this._authorName;
    }

    public get receiverId(): string {
        return this._receiverId;
    }

    public get content(): string {
        return this._content;
    }

    public get messageDate(): Date {
        return this._messageDate;
    }

    public set id(id: number) {
        this._id = id;
    }

    public set authorId(authorId: string) {
        this._authorId = authorId;
    }

    public set authorName(authorName: string) {
        this._authorName = authorName;
    }

    public set receiverId(receiverId: string) {
        this._receiverId = receiverId;
    }

    public set content(content: string) {
        this._content = content;
    }

    public set messageDate(messageDate: Date) {
        this._messageDate = messageDate;
    }
}