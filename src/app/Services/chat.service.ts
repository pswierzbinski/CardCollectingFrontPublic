import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMessagedUsers } from '../Classes/messagedUsersResponse';
import { IMessage, Message } from '../Classes/message';
import { MessageRequest } from '../Classes/sendMessageRequest';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private base = 'https://localhost:7200/Chat/';
  auth = inject(AuthService);

  protected httpOptionsWithToken = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.auth.getToken()}` }),
    withCredentials: true,
  };
  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  constructor(private http: HttpClient) { }
  getMessagesWithUser(userName: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.base + `GetMessagesWithUser?userName=` + userName, this.httpOptionsWithToken);
  }
  getMessagedUsers(): Observable<IMessagedUsers[]> {
    return this.http.get<IMessagedUsers[]>(this.base + `GetMessagedUsers`, this.httpOptionsWithToken);
  }
  getLastFiveMessagedUsers(): Observable<IMessagedUsers[]> {
    return this.http.get<IMessagedUsers[]>(this.base + `GetLastFiveMessagedUsers`, this.httpOptionsWithToken);
  }
  sendMessage(request: any): Observable<Message> {
    return this.http.post<Message>(this.base + `SendMessage`, request, this.httpOptionsWithToken);
  }
}
