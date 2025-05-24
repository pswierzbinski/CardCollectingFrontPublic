import { ChangeDetectorRef, Component, inject, Output } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarketService } from '../../Services/market.service';
import { IMarketRecord, MarketRecord } from '../../Classes/marketRecord';
import { TuiConfirmService, TuiSegmented } from '@taiga-ui/kit';
import { RecordsListComponent } from '../records-list/records-list.component';
import { ICard } from '../../Classes/card';
import { CardService } from '../../Services/card.service';
import { AccountServiceService } from '../../Services/account-service.service';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiIcon, TuiNumberFormat, TuiTextfield } from '@taiga-ui/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiInputNumberModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { chartMarketItem } from '../../Classes/chartMarketItem';
import { SoldPriceComponent } from '../sold-price/sold-price.component';
import { SoldQuantityComponent } from '../sold-quantity/sold-quantity.component';
@Component({
  selector: 'app-market-card-site',
  imports: [TuiSegmented, RecordsListComponent, RouterLink, TuiTextfield, TuiIcon, FormsModule, ReactiveFormsModule, TuiNumberFormat, TuiInputNumberModule, TuiTextfieldControllerModule, SoldPriceComponent, SoldQuantityComponent],
  templateUrl: './market-card-site.component.html',
  styleUrl: './market-card-site.component.css'
})
export class MarketCardSiteComponent {
  public imagePrefix: string = "https://cardcollecting.blob.core.windows.net/images/"
  accountService = inject(AccountServiceService);
  marketService: MarketService = inject(MarketService);
  cardService: CardService = inject(CardService);
  private readonly alerts = inject(TuiAlertService);
  @Output() currentSellRecords: IMarketRecord[] = [];
  @Output() currentBuyRecords: IMarketRecord[] = [];
  hasSellOrder: boolean = false;
  hasBuyOrder: boolean = false;
  view: number = 0; //0 - buy (sell orders), 1 - sell (buy orders)
  //sold orders
  totalSold: number = 0;
  lowestPrice: number = 0;
  highestPrice: number = 0;
  oldOrders: IMarketRecord[] = [];
  @Output() oldOrdersForChart: chartMarketItem[] = [];
  //current orders
  currentSellQuantity: number = 0;
  currentBuyQuantity: number = 0;
  currentLowestSellPrice: number = 0;
  currentHighestBuyPrice: number = 0;
  addOrderForm: FormGroup;
  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.addOrderForm = this.fb.group({
      quantityValue: [1, [Validators.required, Validators.min(1)]],
      priceValue: [1, [Validators.required, Validators.min(0.01)]],
    });
  }
  cardId: number = 0;
  card!: ICard;
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  ngOnInit() {
    this.cardId = this.route.snapshot.params['id'];
    this.cardService.getCard(this.cardId.toString()).subscribe({
      next: (response) => {
        this.card = response;
      },
      error: (error) => {
      },
    });
    this.marketService.getCurrentBuyOrders(this.cardId).subscribe({
      next: (response) => {
        if (response.length == 0)
          return;
        this.currentHighestBuyPrice = response[0].price;
        this.currentBuyRecords = response;
        for (let record of this.currentBuyRecords) {
          this.currentBuyQuantity += record.quantity;
          if (record.price > this.currentHighestBuyPrice) {
            this.currentHighestBuyPrice = record.price;
          }
        }
      },
      error: (error) => {
      },
    });
    this.marketService.getCurrentSellOrders(this.cardId).subscribe({
      next: (response) => {
        this.currentSellRecords = response;
        if (response.length == 0)
          return;
        this.currentLowestSellPrice = response[0].price;
        for (let record of this.currentSellRecords) {
          this.currentSellQuantity += record.quantity;
          if (record.price < this.currentLowestSellPrice) {
            this.currentLowestSellPrice = record.price;
          }
        }
      },
      error: (error) => {
      },
    });
    if (this.accountService.currentUserSignal()) {
      this.marketService.getUsersCurrentRecordsForCard(this.cardId).subscribe({
        next: (response) => {
          for (let record of response) {
            if (record.sellOrder === false) {
              this.hasBuyOrder = true;
            } else {
              this.hasSellOrder = true;
            }
          }
          // shouldnt iterate more than twice because user can have only 2 records for a card (1 buy 1 sell)
        },
        error: (error) => {
        },
      });
    }
    this._ref.detectChanges();
    this.marketService.getFinishedOrders(this.cardId).subscribe({
      next: (response) => {
        if (response.length == 0)
          return;
        this.lowestPrice = response[0].price;
        this.oldOrders = response.map(x => new MarketRecord(x.id, x.cardId, x.userId, x.userName, x.price, x.quantity, x.isSold, x.sellOrder, new Date(x.datePlaced), new Date(x.dateClosed)));
        for (let i = 0; i < this.oldOrders.length; i++) {
          if (this.oldOrders[i].dateClosed.getFullYear() > 1) {
            this.oldOrdersForChart.push(new chartMarketItem(this.oldOrders[i].dateClosed, this.oldOrders[i].price, this.oldOrders[i].quantity));
            this.totalSold += this.oldOrders[i].quantity;
            if (this.oldOrders[i].price < this.lowestPrice) {
              this.lowestPrice = this.oldOrders[i].price;
            }
            if (this.oldOrders[i].price > this.highestPrice) {
              this.highestPrice = this.oldOrders[i].price;
            }
          }
        }

      },
      error: (error) => {
      },
    });
  }




  inCollection: boolean = false;


  private readonly confirm = inject(TuiConfirmService);
  private readonly dialogs = inject(TuiDialogService);
  protected sellOrder: number = 0; //0 - sell, 1 - buy

  protected onModelChange(quantityValue: number, priceValue: number): void {
    this.confirm.markAsDirty();
  }
  protected showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          this.addMarketRecord();
        }
      },
    });
  }

  protected addMarketRecord(): void {

    let quantity = this.addOrderForm.value.quantityValue;
    let price = this.addOrderForm.value.priceValue;
    let sellOrder = this.sellOrder === 0 ? true : false;
    let request = { cardId: this.cardId, price: price, quantity: quantity, sellOrder: sellOrder };
    if (sellOrder === true && this.hasSellOrder) {
      this.alerts.open('You already have a sell order for this card', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
      return;
    } else if (sellOrder === false && this.hasBuyOrder) {
      this.alerts.open('You already have a buy order for this card', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
      return;
    }

    this.marketService.addMarketRecord(request).subscribe({
      next: (response) => {
        this.alerts.open('Order placed', { label: 'Success!', icon: '@tui.check' }).subscribe();
        if (sellOrder === false) {

          this.currentBuyRecords.push(new MarketRecord(response.id, response.cardId, response.userId, response.userName, response.price, response.quantity, false, sellOrder, new Date(response.datePlaced), new Date(response.dateClosed)));
          this.hasBuyOrder = true;
          this._ref.detectChanges();
        } else {
          this.currentSellRecords.push(new MarketRecord(response.id, response.cardId, response.userId, response.userName, response.price, response.quantity, false, sellOrder, new Date(response.datePlaced), new Date(response.dateClosed)));
          this.hasSellOrder = true;
          this._ref.detectChanges();
        }
      },
      error: (error) => {
        this.alerts.open('Order not placed', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
      },
    });
  }
}