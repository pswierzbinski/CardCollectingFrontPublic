import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card, ICard } from '../Classes/card';
import { ICardWithStats } from '../Classes/CardWithStatsResponse';
import { ICreateCardRequest } from '../Classes/CreateCardRequest';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private url = 'https://localhost:7200/Card/';
  auth = inject(AuthService);

  protected httpOptionsWithToken = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.auth.getToken()}`}),
    withCredentials: true,
  };
  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    withCredentials: true,
  };
  protected httpOptionsWithImage = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${this.auth.getToken()}`}),
    withCredentials: true
  };
  constructor(private http: HttpClient) { }
  getCard(card: string): Observable<Card> {
    return this.http.get<Card>(`${this.url}GetCard?id=` + card, this.httpOptions);
  }
  getAllCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.url}GetCardsAll`, this.httpOptions);
  }

  getCardWithStats(id: string): Observable<ICardWithStats> {
    return this.http.get<ICardWithStats>(`${this.url}GetCardWithStats?id=` + id, this.httpOptions);
  }

  createCard(request: ICreateCardRequest): Observable<Card> {
    return this.http.post<Card>(`${this.url}CreateCard`, request, this.httpOptionsWithToken);
  }

  deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.url}DeleteCard?id=` + cardId, this.httpOptionsWithToken);
  }

  editCard(card: ICard): Observable<Card> {
    // there was an error when passing the card object, thus this exists
    let request = { id: card.id, name: card.name, series: card.series, type: card.type, faction: card.faction, subtype: card.subtype, cost: card.cost, loyalty: card.loyalty, attack: card.attack, defense: card.defense, ruleText: card.ruleText, description: card.description, artist: card.artist, source: card.source, licence: card.licence};
    return this.http.put<Card>(`${this.url}EditCard`, request , this.httpOptionsWithToken);
  }

  addImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('Name', image.name);
    formData.append('File', image);
    return this.http.post(`https://localhost:7200/images/uploadImage`, formData, this.httpOptionsWithImage);
  }

  removeImage(cardName: string){
    return this.http.delete(`https://localhost:7200/images/blobName?blobName=${cardName}`);
  }
}
