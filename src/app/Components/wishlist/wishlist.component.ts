import { NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAlertService, TuiHint, TuiIcon } from '@taiga-ui/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CollectionService } from '../../Services/collection.service';
import { AccountServiceService } from '../../Services/account-service.service';
import { WishlistService } from '../../Services/wishlist.service';
import { ICard } from '../../Classes/card';
import { Router, RouterLink } from '@angular/router';
import { TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-wishlist',
  imports: [NgMultiSelectDropDownModule, NgFor, FormsModule, TuiIcon, TuiHint, RouterLink, TuiPagination],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  accountService = inject(AccountServiceService);
  collectionService = inject(CollectionService);
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  wishlistService = inject(WishlistService);
  @Input() userName!: string | undefined;
  @Input() quantity!: number[];
  @Input() quantityMap: Map<number, number> = new Map<number, number>();
  @Input() wishlist!: ICard[];
  @Input() simpleWishlist!: number[];
  @Output() updateWishlistEvent = new EventEmitter<ICard[]>();
  public imagePrefix: string = "https://cardcollecting.blob.core.windows.net/images/"
  defaultImage: string = "no-image-pexels-stock.jpg"
  private readonly alerts = inject(TuiAlertService);
  cards: ICard[] = [];
  constructor(private _router: Router) { }
  public length: number = 0;
  public tmp!: string[];
  public types!: string[];
  protected indx = 0;
  filteredCards: ICard[] = [];
  dropdownSettings = {};
  selectedTypes!: string[];
  sortType: string = 'id'
  pageSize: number = 10;
  view: number = 0; //0 - collection, 1 - wishlist
  protected goToPage(indx: number): void {
    this.indx = indx;
    console.info('New page:', indx);
  }
  sortId(): void {
    if (this.sortType == 'id') {
      this.sortType = 'idDesc';
      this.filteredCards = this.filteredCards.sort((a, b) => b.id - a.id);
    }
    else {
      this.sortType = 'id';
      this.filteredCards = this.filteredCards.sort((a, b) => a.id - b.id);
    }
  }
  sortName(): void {
    if (this.sortType == 'name') {
      this.sortType = 'nameDesc';
      this.filteredCards = this.filteredCards.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      this.sortType = 'name';
      this.filteredCards = this.filteredCards.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  onItemSelect(item: any) {
    this.filteredCards = this.cards.filter(card => this.selectedTypes.includes(card.type));
    this.length = Math.ceil(this.filteredCards.length / 10);
    if (this.indx > this.length - 1) {
      this.indx = 0;
      this._ref.detectChanges();
    }
  }
  onDeSelect(item: any) {
    if (this.selectedTypes.length == 0) {
      this.filteredCards = this.cards;
    } else
      this.filteredCards = this.cards.filter(card => this.selectedTypes.includes(card.type));

    this.length = Math.ceil(this.filteredCards.length / 10);
    if (this.indx > this.length - 1) {
      this.indx = 0;
      this._ref.detectChanges();
    }
  }
  onSelectAll(items: any) {
    this.filteredCards = this.cards;
    this.length = Math.ceil(this.filteredCards.length / 10);
  }
  ngOnInit() {
    this.cards = this.wishlist;
    this.length = Math.ceil(this.cards.length / 10);
    this.filteredCards = this.wishlist;
    this.tmp = this.cards.map(card => card.type);
    this.types = [...new Set(this.tmp)];
    this._ref.detectChanges();
  }

  addToWishlist(id: number) {
    this.wishlistService.addCardToWishlist(id).subscribe({
      next: () => {
        this.wishlist.push(this.cards.find(cc => cc.id === id)!);
        this.simpleWishlist = this.wishlist.map(card => card.id);
        this.updateWishlistEvent.emit(this.wishlist);
        this.alerts.open(`Card has been added to wishlist.`, { label: 'Success!', icon: '@tui.material.filled.favorite' }).subscribe();
        this._ref.detectChanges();
      },
      error: (error) => {
        this.alerts.open(`Card not added to wishlist.`, { label: 'Error!', icon: '@tui.circle-x', appearance: 'negatiave' },).subscribe();
      },
    });

  }
  removeFromWishlist(id: number) {
    this.wishlistService.removeCardFromWishlist(id).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(cc => cc.id !== id);
        this.simpleWishlist = this.wishlist.map(card => card.id);
        this.updateWishlistEvent.emit(this.wishlist);
        this.alerts.open(`Card has been removed from wishlist.`, { label: 'Success :(', icon: '@tui.material.filled.favorite_border' }).subscribe();
        this._ref.detectChanges();
      },
      error: (error) => {
        this.alerts.open(`Card not removed from wishlist.`, { label: 'Error!', icon: '@tui.circle-x', appearance: 'negatiave' },).subscribe();
      },
    });
  }
  useDefaultImage(e: Event){
    const img = e.target as HTMLImageElement;
    img.src = this.defaultImage;
  }
}
