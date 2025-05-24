import { ChangeDetectorRef, Component, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { AccountServiceService } from '../../Services/account-service.service';
import { CollectionService } from '../../Services/collection.service';
import { MarketService } from '../../Services/market.service';
import { WishlistService } from '../../Services/wishlist.service';
import { ICard } from '../../Classes/card';
import { IMarketUserRespsonse } from '../../Classes/marketUserResponse';
import { User } from '../../Classes/user';
import { DatePipe } from '@angular/common';
import { CollectionComponent } from '../collection/collection.component';
import { TuiSegmented } from '@taiga-ui/kit';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { UsersRecordsListComponent } from '../users-records-list/users-records-list.component';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, TuiIcon, DatePipe, CollectionComponent, TuiSegmented, WishlistComponent, UsersRecordsListComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userName!: string;
  hasCollection: boolean = false;
  hasWishlist: boolean = false;
  hasSellRecords: boolean = false;
  hasBuyRecords: boolean = false;
  user!: User;
  accountService = inject(AccountServiceService);
  collectionService = inject(CollectionService);
  marketService = inject(MarketService);
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  wishlistService = inject(WishlistService);
  @Output() wishlist: ICard[] = [];
  @Output() cards!: ICard[];
  @Output() quantity!: number[];
  @Output() quantityMap: Map<number, number> = new Map<number, number>();
  @Output() currentSellRecords: IMarketUserRespsonse[] = [];
  @Output() currentBuyRecords: IMarketUserRespsonse[] = [];
  public types!: string[];
  view: number = 0; //0 - collection, 1 - wishlist, 2 market records
  //some stats for profile
  cardsInCollection: number = 0;
  cardsInWishlist: number = 0;
  cardsSelling: number = 0;
  cardsBuying: number = 0;
  cardsOnMarket: number = 0;
  constructor(private route:ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.userName = params.get('userName')!;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
  }
  ngOnInit(){
    if(this.userName != null && this.userName != " "){
      this.accountService.GetUserByName(this.userName).subscribe({
        next: (response) => {
          this.user = new User(response.id, response.username, response.email, new Date(response.creationDate));
        },
        error: (error) => {
          console.log('Error getting user', error);
        },
      });
      this.collectionService.getUsersCollection(this.userName).subscribe({
        next: (response) => {
          this.hasCollection = true;
          this.cards = response.cards;
          this.quantity = response.quantity;
        let tmp = this.cards.map(card => card.type);
        this.types = [...new Set(tmp)];
          for(let i = 0; i < this.quantity.length; i++){
            this.cardsInCollection += this.quantity[i];
          }
      this.mapQuantity();
      this._ref.detectChanges(); 
        this.wishlistService.getUsersWishlist(this.userName).subscribe({
          next: (response) => {
            this.hasWishlist = true;
            this.wishlist = response.cards.map(card => card);
      this._ref.detectChanges(); 
          },
          error: (error) => {
            console.log('Error getting wishlist', error);
          },
        });
          this._ref.detectChanges(); 
        },
        error: (error) => {
          console.log('getting collection failed', error);
        },
      });
      this.marketService.getUsersCurrentBuyOrders(this.userName).subscribe({
        next: (response) => {
          this.currentBuyRecords = response;
          if(this.currentBuyRecords.length > 0)
          this.hasBuyRecords = true;
          for(let i = 0; i < response.length; i++){
            this.cardsBuying += response[i].quantity;
          }
        },
        error: (error) => {
          console.log('Error getting current buy orders', error);
        },
      });
      this.marketService.getUsersCurrentSellOrders(this.userName).subscribe({
        next: (response) => {
          this.currentSellRecords = response;
          if(this.currentSellRecords.length > 0)
          this.hasSellRecords = true;
          for(let i = 0; i < response.length; i++){
            this.cardsBuying += response[i].quantity;
          }
        },
        error: (error) => {
          console.log('Error getting current sell orders', error);
        },
      });
      
      this._ref.detectChanges();
    }
  }

  mapQuantity(){
    this.quantityMap = new Map<number, number>();
    this.cards.forEach((card, index) => {
      this.quantityMap.set(card.id, this.quantity[index]);
  });
  }
}
