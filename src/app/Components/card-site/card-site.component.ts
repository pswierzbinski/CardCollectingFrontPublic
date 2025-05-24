import { ChangeDetectorRef, Component, inject, Output } from '@angular/core';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { TiltComponent } from '../tilt/tilt.component';
import { CardComment } from '../../Classes/cardComment';
import { CardCommentComponent } from '../card-comment/card-comment.component';
import { TUI_MONTHS, TuiAlertService, TuiAppearance, TuiDialogContext, TuiDialogService, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TUI_IS_E2E, TuiPortals, } from '@taiga-ui/cdk';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardService } from '../../Services/card.service';
import { CommentService, ICardCommentRequest } from '../../Services/comment.service';
import { WishlistService } from '../../Services/wishlist.service';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiConfirmService } from '@taiga-ui/kit';
import { CollectionService } from '../../Services/collection.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { ICardWithStats } from '../../Classes/CardWithStatsResponse';
import { IMarketRecord } from '../../Classes/marketRecord';
import { MarketService } from '../../Services/market.service';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import { chartMarketItem } from '../../Classes/chartMarketItem';
import { AccountServiceService } from '../../Services/account-service.service';

@Component({
  selector: 'app-card-site',
  imports: [TiltComponent, NgFor, NgIf, CardCommentComponent, TuiIcon, AddCommentComponent, FormsModule, ReactiveFormsModule, TuiTextfield, TuiBlockStatus, TuiAppearance, NgForOf, NgIf,
    TuiInputDateRangeModule, RouterLink, TuiHint],
  templateUrl: './card-site.component.html',
  styleUrl: './card-site.component.less'
})
export class CardSiteComponent extends TuiPortals {
  accountService: AccountServiceService = inject(AccountServiceService);
  private readonly isE2E = inject(TUI_IS_E2E);
  private readonly months$ = inject(TUI_MONTHS);
  private readonly alerts = inject(TuiAlertService);
  //sold orders
  totalSold: number = 0;
  lowestPrice: number = 0;
  highestPrice: number = 0;

  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  marketInfo: IMarketRecord[] = [];
  @Output() marketInfoForChart: chartMarketItem[] = [];
  buyMarketInfo: IMarketRecord[] = [];
  sellMarketInfo: IMarketRecord[] = [];
  constructor(private route: ActivatedRoute) { super(); }
  cardService: CardService = inject(CardService);
  commentService: CommentService = inject(CommentService);
  wishlistService: WishlistService = inject(WishlistService);
  marketService: MarketService = inject(MarketService);
  inWishlist: boolean = false;
  collectionService: CollectionService = inject(CollectionService);
  public id!: string;
  public card!: ICardWithStats;
  public imagePrefix: string = "https://cardcollecting.blob.core.windows.net/images/"
  @Output() comments: CardComment[] = [];
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    //card
    this.cardService.getCardWithStats(this.id).subscribe({
      next: (response) => {
        this.card = response;
      },
      error: (error) => {
        console.log('Card not found', error);
      },
    });
    //comments
    this.commentService.getCardComments(parseInt(this.id)).subscribe({
      next: (response) => {
        for (let i = 0; i < response.length; i++) {
          this.comments.push(new CardComment(response[i].id, response[i].comment, new Date(response[i].date), response[i].cardId, response[i].userId, response[i].userName));
        }
      },
      error: (error) => {
        console.log('Comments not found', error);
      },
    });
    //wishlist
    if (this.accountService.currentUserSignal())
      this.wishlistService.isCardInWishlist(parseInt(this.id)).subscribe({
        next: (response) => {
          this.inWishlist = response;
        },
        error: (error) => {
          console.log('Error checking if card is in wishlist', error);
        },
      });
  }
  addCardComment(comment: string) {
    let request: ICardCommentRequest = { comment: comment, cardId: this.card.id.toString() };
    this.commentService.addCardComment(request).subscribe({
      next: (response) => {
        this.comments.push(new CardComment(response.id, response.comment, new Date(response.date), response.cardId, response.userId, response.userName));
        this._ref.detectChanges();
        this.alerts.open(`Comment succesfully added.`, { label: 'Success!', icon: '@tui.check' }).subscribe();
      },
      error: (error) => {
        this.alerts.open(`Comment not added.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      },
    });
  }

  removeCardComment(id: number) {
    this.commentService.deleteCardComment(id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== id);
        this._ref.detectChanges();
        this.alerts.open(`Comment succesfully deleted.`, { label: 'Success!', icon: '@tui.trash-2' }).subscribe();
      },
      error: (error) => {
        this.alerts.open(`Could not delete comment.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      },
    });
  }
  addToWishlist() {
    this.wishlistService.addCardToWishlist(this.card.id).subscribe({
      next: () => {
        this.inWishlist = true;
        this.alerts.open(`Card has been added to wishlist.`, { label: 'Success!', icon: '@tui.material.filled.favorite' }).subscribe();
      },
      error: (error) => {
        this.alerts.open(`Adding card to wishlist failed.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      },
    });

  }
  removeFromWishlist() {
    this.wishlistService.removeCardFromWishlist(this.card.id).subscribe({
      next: () => {
        this.inWishlist = false;
        this.alerts.open(`Card has been removed from wishlist.`, { label: 'Success :(', icon: '@tui.material.filled.favorite_border' }).subscribe();
      },
      error: (error) => {
        this.alerts.open(`Removing card from wishlist failed.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      },
    });
  }

  inCollection: boolean = false;
  private readonly confirm = inject(TuiConfirmService);
  private readonly dialogs = inject(TuiDialogService);
  protected quantityValue = '';
  protected onModelChange(quantityValue: string): void {
    this.quantityValue = quantityValue;
    this.confirm.markAsDirty();
  }
  protected showDialog(content: PolymorpheusContent<TuiDialogContext>, id: number, quantity: number): void {
    this.quantityValue = quantity.toString();
    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          this.addCardToCollection(id, parseInt(this.quantityValue));
        }
      },
    });
  }


  deleteComment(content: PolymorpheusContent<TuiDialogContext>, id: number) {
    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          this.removeCardComment(id);
        }
      },
    });
  }

  protected addCardToCollection(id: number, quantity: number,): void {
    let request = { cardId: id, quantity: quantity };
    if (quantity <= 0) {
      this.alerts.open(`Can't add a quantity lower than 0`, { label: 'Bruh!', icon: '@tui.skull', appearance: 'negative' }).subscribe();
    } else {

      this.collectionService.addCardToCollection(request).subscribe({
        next: () => {
          this.alerts.open(`<p>${this.card.name} has been added to your collection</p> <p>in quantity of: ${quantity}</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.check' }).subscribe();
        },
        error: (error) => {
          this.alerts.open(`Adding card to collection failed.`, { label: 'Error!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
        },
      });
    }
  }
}