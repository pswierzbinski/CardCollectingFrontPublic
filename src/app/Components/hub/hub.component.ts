import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Output } from '@angular/core';
import { ICard } from '../../Classes/card';
import { TuiHint } from '@taiga-ui/core';
import { AccountServiceService } from '../../Services/account-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../Services/collection.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../Services/wishlist.service';
import { TuiSegmented } from '@taiga-ui/kit';
import { CollectionComponent } from '../collection/collection.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { MarketService } from '../../Services/market.service';
import { IMarketUserRespsonse } from '../../Classes/marketUserResponse';
import { UsersRecordsListComponent } from '../users-records-list/users-records-list.component';

@Component({
  selector: 'app-hub',
  imports: [TuiHint, NgMultiSelectDropDownModule, FormsModule, TuiSegmented, CollectionComponent, WishlistComponent, UsersRecordsListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.css'
})

export class HubComponent {
  accountService = inject(AccountServiceService);
  collectionService = inject(CollectionService);
  marketService = inject(MarketService);
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  wishlistService = inject(WishlistService);
  @Output() simpleWishlist: number[] = [];
  @Output() wishlist: ICard[] = [];
  @Output() cards!: ICard[];
  @Output() quantity!: number[];
  @Output() quantityMap: Map<number, number> = new Map<number, number>();
  @Output() currentSellRecords: IMarketUserRespsonse[] = [];
  @Output() currentBuyRecords: IMarketUserRespsonse[] = [];
  constructor(private _router: Router, private route: ActivatedRoute) { }
  public tmp!: string[];
  public types!: string[];
  view: number = 0; //0 - collection, 1 - wishlist, 2 - market

  ngOnInit() {
    let tmp = this.route.snapshot.params['view'];
    this.collectionService.getCollection().subscribe({
      next: (response) => {
        this.cards = response.cards;
        if (this.cards == null) {
          return;
        }
        this.quantity = response.quantity;
        this.tmp = this.cards.map(card => card.type);
        this.types = [...new Set(this.tmp)];
        this.mapQuantity();
        this.wishlistService.getWishlist().subscribe({
          next: (response) => {
            this.wishlist = response.cards.map(card => card);
            this.simpleWishlist = this.wishlist.map(card => card.id);
            if (tmp == 'collection') {
              this.view = 0;
            } else if (tmp == 'wishlist') {
              this.view = 1;
            }
            this._ref.detectChanges();
          },
          error: (error) => {
          },
        });
        this._ref.detectChanges();
      },
      error: (error) => {
      },
    });
    this.marketService.getMyCurrentBuyOrders().subscribe({
      next: (response) => {
        this.currentBuyRecords = response;
      },
      error: (error) => {
      },
    });
    this.marketService.getMyCurrentSellOrders().subscribe({
      next: (response) => {
        this.currentSellRecords = response;
      },
      error: (error) => {
      },
    });
    this._ref.detectChanges();
  }
  updateWishlistEvent(event: ICard[]): void {
    this.wishlist = event;
    this.simpleWishlist = this.wishlist.map(card => card.id);
    this._ref.detectChanges();
  }
  updateCollectionEvent(event: number[]): void {
    this.quantity = event;
    this._ref.detectChanges();
  }
  updateCardsEvent(event: ICard[]): void {
    this.cards = event;
    this._ref.detectChanges();
  }
  updateQuantityEvent(event: number[]): void {
    this.quantity = event;
    this._ref.detectChanges();
  }
  mapQuantity() {
    this.quantityMap = new Map<number, number>();
    this.cards.forEach((card, index) => {
      this.quantityMap.set(card.id, this.quantity[index]);
    });
  }
}
