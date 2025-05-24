import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWishlist } from '../Classes/wishlist';
export interface ISimpleWishlist {
  cardId: number[];
}
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private base = 'https://localhost:7200/Wishlist/';
  auth = inject(AuthService);

  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.auth.getToken()}` }),
    withCredentials: true,
  };
  constructor(private http: HttpClient) { }

  addCardToWishlist(cardId: number) {
    return this.http.post(`${this.base}AddCardToWishlist`, { cardId }, this.httpOptions);
  }
  getWishlist(): Observable<IWishlist> {
    return this.http.get<IWishlist>(`${this.base}GetWishlist`, this.httpOptions);
  }
  getUsersWishlist(userName: string): Observable<IWishlist> {
    return this.http.get<IWishlist>(`${this.base}GetUsersWishlist?userName=${userName}`, this.httpOptions);
  }
  getSimpleWishlist(): Observable<ISimpleWishlist> {
    return this.http.get<ISimpleWishlist>(`${this.base}GetSimpleWishlist`, this.httpOptions);
  }
  removeCardFromWishlist(cardId: number) {
    return this.http.patch(`${this.base}RemoveCardFromWishlist`, { cardId }, this.httpOptions);
  }
  isCardInWishlist(cardId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.base}IsCardInWishlist?cardId=${cardId}`, this.httpOptions);
  }
}
