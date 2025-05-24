import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICollection } from '../Classes/collection';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ICardCollectinoRequest } from '../Classes/cardCollectionRequest';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private base = 'https://localhost:7200/Collection/';
  auth = inject(AuthService);

  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.auth.getToken()}` }),
    withCredentials: true,
  };
  constructor(private http: HttpClient) { }
  getCollection(): Observable<ICollection> {
    return this.http.get<ICollection>(`${this.base}GetCollection`, this.httpOptions);
  }

  getUsersCollection(userName: string): Observable<ICollection> {
    return this.http.get<ICollection>(`${this.base}GetUsersCollection?username=${userName}`, this.httpOptions);
  }

  addCardToCollection(request: ICardCollectinoRequest): Observable<ICardCollectinoRequest> {
    return this.http.post<ICardCollectinoRequest>(`${this.base}AddCardToCollection`, request, this.httpOptions);
  }

  removeCardFromCollection(cardId: number, quantity: number): Observable<ICollection> {
    return this.http.patch<ICollection>(`${this.base}RemoveCardFromCollection`, { cardId, quantity }, this.httpOptions);
  }
  editCardInCollection(request: ICardCollectinoRequest) {
    return this.http.put(`${this.base}ChangeQuantity`, request, this.httpOptions);
  }
}
