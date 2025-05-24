import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMarketRecordRequest } from '../Classes/marketRecordRequest';
import { IMarketRecord } from '../Classes/marketRecord';
import { Observable } from 'rxjs';
import { IMarketUserRespsonse } from '../Classes/marketUserResponse';
export interface IEditMarketRecordRequest {
  cardId: number;
  price: number;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private base = 'https://localhost:7200/Market/';
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

  addMarketRecord(request: IMarketRecordRequest): Observable<IMarketRecord> {
    return this.http.post<IMarketRecord>(`${this.base}AddMarketRecord`, request, this.httpOptionsWithToken);
  }

  cancelOrder(orderId: number): Observable<IMarketRecord> {
    return this.http.delete<IMarketRecord>(`${this.base}CancelOrder?id=` + orderId, this.httpOptionsWithToken);
  }
  completeOrder(orderId: number) {
    return this.http.patch(`https://localhost:7200/Market/CompleteMarketRecord?id=` + orderId, {}, this.httpOptionsWithToken);
  }
  getAllMarketRecords(): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetAllMarketRecords`, this.httpOptions);
  }
  getMarketRecordsForUser(): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetMarketRecordsForUser`, this.httpOptionsWithToken);
  }
  getMarketRecordsForCard(cardId: number): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetMarketRecordsForCard?id=${cardId}`, this.httpOptions);
  }
  getMarketRecord(recordId: number): Observable<IMarketRecord> {
    return this.http.get<IMarketRecord>(`${this.base}GetMarketRecord?id=${recordId}`, this.httpOptions);
  }
  editMarketRecord(request: IEditMarketRecordRequest) {
    let price = request.price;
    let quantity = request.quantity;
    return this.http.patch(`${this.base}EditMarketRecord?id=` + request.cardId, { price, quantity }, this.httpOptionsWithToken);
  }

  getFinishedSellOrders(cardId: number): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetFinishedSellOrders?id=${cardId}`, this.httpOptions);
  }
  getFinishedBuyOrders(cardId: number): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetFinishedBuyOrders?id=${cardId}`, this.httpOptions);
  }
  getFinishedOrders(cardId: number): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetFinishedOrders?id=${cardId}`, this.httpOptions);
  }
  getCurrentSellOrders(cardId: number): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetCurrentSellOrders?id=${cardId}`, this.httpOptions);
  }
  getCurrentBuyOrders(cardId: number): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetCurrentBuyOrders?id=${cardId}`, this.httpOptions);
  }
  getUsersCurrentRecordsForCard(cardId: number): Observable<IMarketRecord[]> {
    return this.http.get<IMarketRecord[]>(`${this.base}GetUsersCurrentRecordsForCard?id=${cardId}`, this.httpOptionsWithToken);
  }

  getMyCurrentSellOrders(): Observable<IMarketUserRespsonse[]> {
    return this.http.get<IMarketUserRespsonse[]>(`${this.base}GetMyCurrentSellOrders`, this.httpOptionsWithToken);
  }
  getMyCurrentBuyOrders(): Observable<IMarketUserRespsonse[]> {
    return this.http.get<IMarketUserRespsonse[]>(`${this.base}GetMyCurrentBuyOrders`, this.httpOptionsWithToken);
  }
  getUsersCurrentSellOrders(userName: string): Observable<IMarketUserRespsonse[]> {
    return this.http.get<IMarketUserRespsonse[]>(`${this.base}GetUsersCurrentSellOrders?username=${userName}`, this.httpOptionsWithToken);
  }
  getUsersCurrentBuyOrders(userName: string): Observable<IMarketUserRespsonse[]> {
    return this.http.get<IMarketUserRespsonse[]>(`${this.base}GetUsersCurrentBuyOrders?username=${userName}`, this.httpOptionsWithToken);
  }
}
