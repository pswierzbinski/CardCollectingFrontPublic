import { NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiConfirmService, TuiFade, TuiPagination } from '@taiga-ui/kit';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AccountServiceService } from '../../Services/account-service.service';
import { CollectionService } from '../../Services/collection.service';
import { ICard } from '../../Classes/card';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-collection',
  imports: [NgFor, TuiHint, RouterLink, NgMultiSelectDropDownModule, FormsModule, TuiIcon, TuiTextfield, TuiFade, TuiPagination],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent {
  private readonly alerts = inject(TuiAlertService);
  accountService = inject(AccountServiceService);
  collectionService = inject(CollectionService);
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  @Input() userName!: string | undefined;
  @Input() simpleWishlist!: number[];
  @Input() cards!: ICard[];
  @Input() quantity!: number[];
  @Output() updateQuantityEvent = new EventEmitter<number[]>();
  @Output() updateCardsEvent = new EventEmitter<ICard[]>();
  @Input() quantityMap: Map<number, number> = new Map<number, number>();
  filteredQuantity!: number[];
  public imagePrefix: string = "https://cardcollecting.blob.core.windows.net/images/";
  defaultImage: string = "no-image-pexels-stock.jpg";
  constructor() { }
  length: number = 1;
  public tmp!: string[];
  public types!: string[];
  protected indx = 0;
  filteredCards: ICard[] = [];
  dropdownList = [];
  dropdownSettings = {};
  selectedTypes!: string[];
  sortType: string = 'id'
  pageSize: number = 10;
  protected goToPage(indx: number): void {
    this.indx = indx;
  }
  arrangeQuantity() {
    this.filteredQuantity = this.filteredCards.map(card => this.quantityMap.get(card.id) || 0);
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
    this.arrangeQuantity();
  }
  sortName(): void {
    if (this.sortType == 'name') {
      this.sortType = 'nameDesc';
      this.filteredCards = this.filteredCards.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      this.sortType = 'name';
      this.filteredCards = this.filteredCards.sort((a, b) => a.name.localeCompare(b.name));
    }
    this.arrangeQuantity();
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
      this.filteredQuantity = this.quantity;
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
    this.filteredQuantity = this.quantity;
    this.length = Math.ceil(this.filteredCards.length / 10);
  }
  ngOnInit() {
    if (this.cards) {
      this.length = Math.ceil(this.cards.length / 10);
      this.tmp = this.cards.map(card => card.type);
      this.filteredCards = this.cards;
      this.filteredQuantity = this.quantity;
      this.types = [...new Set(this.tmp)];
    }

    this._ref.detectChanges();
  }

  removeFromCollection(id: number, quantity: number) {
    this.collectionService.removeCardFromCollection(id, quantity).subscribe({
      next: () => {
        this.quantity[this.cards.findIndex(card => card.id == id)] -= quantity;
      },
      error: (error) => {
        this.alerts.open(`Removing card from collection failed.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      },
    });
  }

  private readonly confirm = inject(TuiConfirmService);
  private readonly dialogs = inject(TuiDialogService);
  protected value = '';
  protected onModelChange(value: string): void {
    this.value = value;
    this.confirm.markAsDirty();
  }
  protected showDialog(content: PolymorpheusContent<TuiDialogContext>, id: number, quantity: number, choose: PolymorpheusContent,): void {
    this.value = quantity.toString();

    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          this.changeQuantity(id, parseInt(this.value), choose);
        }
      },
    });
  }
  protected changeQuantity(id: number, quantity: number, choose: PolymorpheusContent,): void {
    let request = { cardId: id, quantity: quantity };
    if (quantity == 0) {
      this.dialogs
        .open<boolean>(choose
        )
        .subscribe({
          next: (value) => {
            if (!value) return;

            this.collectionService.editCardInCollection(request).subscribe({
              next: () => {
                if (request.quantity == 0) {
                  this.cards.splice(this.cards.findIndex(card => card.id == id), 1);
                  this.quantity.splice(this.cards.findIndex(card => card.id == id), 1);
                  this.types = [...new Set(this.cards.map(card => card.type))];
                  this._ref.detectChanges();
                } else {
                  this.quantity[this.cards.findIndex(card => card.id == id)] = quantity;
                  this._ref.detectChanges();
                }
              },
              error: (error) => {
                this.alerts.open(`Changing card quantity failed.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
              },
            });
          },
        });
    } else if (quantity < 0) {
      this.alerts.open(`Can't set the quantity lower than 0`, { label: '', icon: '@tui.skull', appearance: 'negative' }).subscribe();
    } else {
      this.collectionService.editCardInCollection(request).subscribe({
        next: () => {
          this.quantity[this.cards.findIndex(card => card.id == id)] = quantity;
          this._ref.detectChanges();
        },
        error: (error) => {
          this.alerts.open(`Changing card quantity failed.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
        },
      });
    }
  }
  useDefaultImage(e: Event){
    const img = e.target as HTMLImageElement;
    img.src = this.defaultImage;
  }
}
