import { NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiIcon, TuiNumberFormat } from '@taiga-ui/core';
import { TuiConfirmService } from '@taiga-ui/kit';
import { TuiInputNumberModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { IEditMarketRecordRequest, MarketService } from '../../Services/market.service';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { Router } from '@angular/router';
import { AccountServiceService } from '../../Services/account-service.service';
import { IMarketUserRespsonse } from '../../Classes/marketUserResponse';

@Component({
  selector: 'app-users-records-list',
  imports: [NgFor, TuiInputNumberModule, ReactiveFormsModule, TuiTextfieldControllerModule, FormsModule, TuiNumberFormat, TuiIcon],
  templateUrl: './users-records-list.component.html',
  styleUrl: './users-records-list.component.css'
})
export class UsersRecordsListComponent {
  private readonly alerts = inject(TuiAlertService);
  @Input() records: IMarketUserRespsonse[] = [];
  @Input() userName!: string;
  sortType: string = 'price';
  @Input() listType: string = 'sell'; //sell or buy to use right sort type on init
  filteredRecords: IMarketUserRespsonse[] = [];
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  accountService: AccountServiceService = inject(AccountServiceService);
  marketService: MarketService = inject(MarketService);
  editOrderForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.editOrderForm = this.fb.group({
      quantityValue: [1, [Validators.required, Validators.min(1)]],
      priceValue: [1, [Validators.required, Validators.min(0.01)]],
    });
  }
  ngOnInit() {
    this.filteredRecords = this.records.sort((a, b) => a.price - b.price)
    if (this.listType === 'sell') {
      this.sortType = 'price';
    } else {
      this.sortType = 'priceDesc';
    }
    this.sort();
    this._ref.detectChanges();
  }

  sort() {
    switch (this.sortType) {
      case 'price':
        this.records.sort((a, b) => a.price - b.price)
        break;
      case 'priceDesc':
        this.records.sort((a, b) => b.price - a.price)
        break;
      case 'quantity':
        this.records.sort((a, b) => a.quantity - b.quantity)
        break;
      case 'quantityDesc':
        this.records.sort((a, b) => b.quantity - a.quantity)
        break;
      case 'tmp':
        this.sortPrice();
        break;
    }
  }

  sortQuantity() {
    if (this.sortType === 'quantity') {
      this.sortType = 'quantityDesc';
    } else {
      this.sortType = 'quantity';
    }
    this.sort();
  }
  sortPrice() {
    if (this.sortType === 'price') {
      this.sortType = 'priceDesc';
    } else {
      this.sortType = 'price';
    }
    this.sort();
  }

  private readonly confirm = inject(TuiConfirmService);
  private readonly dialogs = inject(TuiDialogService);
  protected sellOrder: number = 0; //0 - sell, 1 - buy | this is a number because I am using it with tui-segmented for better visual representation and not a radio

  protected showCompleteDialog(content: PolymorpheusContent<TuiDialogContext>, orderId: number): void {
    this.dialogs
      .open<boolean>(content
      )
      .subscribe({
        next: (value) => {
          if (!value) return;
          this.marketService.completeOrder(orderId).subscribe({
            next: (response) => {
              this.records.splice(this.records.findIndex(record => record.id == orderId), 1);
              this.confirm.markAsDirty();
              this._ref.detectChanges();
            }, error: (error) => {
              this.alerts.open(`An error ocurred while trying to complete the order.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
            }
          });
        }
      });
  }
  protected showCancelDialog(content: PolymorpheusContent<TuiDialogContext>, orderId: number): void {
    this.dialogs
      .open<boolean>(content
      )
      .subscribe({
        next: (value) => {
          if (!value) return;
          this.marketService.cancelOrder(orderId).subscribe({
            next: (response) => {
              this.records.splice(this.records.findIndex(record => record.id == orderId), 1);
              this.confirm.markAsDirty();
              this._ref.detectChanges();
            }, error: (error) => {
              this.alerts.open(`An error ocurred while cancelling the order.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
            }
          });
        }
      });
  }


  protected showDialog(content: PolymorpheusContent<TuiDialogContext>, orderId: number, quantity: number, price: number): void {
    if (this.records)
      this.editOrderForm.setValue({ quantityValue: quantity, priceValue: price });
    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          this.editMarketRecord(orderId);
        }
      },
    });
  }

  protected editMarketRecord(orderId: number): void {
    let quantity = this.editOrderForm.value.quantityValue;
    let price = this.editOrderForm.value.priceValue;
    let request: IEditMarketRecordRequest = { cardId: orderId, quantity: quantity, price: price };
    this.marketService.editMarketRecord(request).subscribe({
      next: () => {
        var recordIndex = this.records.findIndex(record => record.id == orderId);
        this.records[recordIndex].price = price;
        this.records[recordIndex].quantity = quantity;
        this.sort();
        this.confirm.markAsDirty();
        this.alerts.open(`<p>The order has been successfully edited</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.pencil' }).subscribe();
        this._ref.detectChanges();
      }, error: (error) => {
        this.alerts.open(`An error ocurred while editing the order.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      }
    });
  }
}
