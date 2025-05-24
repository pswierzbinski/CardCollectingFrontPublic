export interface IMessageRequest {
    receiverId: string;
    content: string;
}

export class MessageRequest {
    private _receiverId: string;
    private _content: string;

    constructor(receiverId: string, content: string) {
        this._receiverId = receiverId;
        this._content = content;
    }

    public get receiverId(): string {
        return this._receiverId;
    }

    public get content(): string {
        return this._content;
    }

    public set receiverId(receiverId: string) {
        this._receiverId = receiverId;
    }

    public set content(content: string) {
        this._content = content;
    }
}