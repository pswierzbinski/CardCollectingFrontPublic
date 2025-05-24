import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CardComment, ICardComment } from '../Classes/cardComment';

export interface ICardCommentRequest {
  comment: string;
  cardId: string;
}
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private base = 'https://localhost:7200/CardComment/';
  auth = inject(AuthService);
  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  protected httpOptionsWithToken = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.auth.getToken()}` }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) { }

  addCardComment(addCardComment: ICardCommentRequest) {
    return this.http.post<ICardComment>(`${this.base}AddCardComment`, addCardComment, this.httpOptionsWithToken);
  }
  getCardComments(cardId: number) {
    return this.http.get<CardComment[]>(`${this.base}GetAllCardComments?cardId=${cardId}`, this.httpOptions);
  }
  deleteCardComment(commentId: number) {
    return this.http.delete(`${this.base}DeleteCardComment?id=${commentId}`, this.httpOptionsWithToken);
  }
  editCardComment(comment: ICardCommentRequest) {
    return this.http.put<ICardComment>(`${this.base}EditCardComment?Id=${comment.cardId}`, comment.comment, this.httpOptionsWithToken);
  }
}
