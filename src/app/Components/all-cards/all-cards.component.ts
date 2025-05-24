import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TuiAlertService, TuiButton, TuiDataList, TuiDialogContext, TuiDialogService, TuiDropdown, TuiHint, TuiIcon, TuiNumberFormat, TuiTextfield } from '@taiga-ui/core';
import { Card } from '../../Classes/card';
import { TuiConfirmService, TuiFileLike, TuiFiles, TuiPagination } from '@taiga-ui/kit';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CardService } from '../../Services/card.service';
import { AccountServiceService } from '../../Services/account-service.service';
import { CollectionService } from '../../Services/collection.service';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiInputNumberModule } from '@taiga-ui/legacy';
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';
import { ICreateCardRequest } from '../../Classes/CreateCardRequest';


@Component({
  selector: 'app-all-cards',
  imports: [NgFor, TuiHint, TuiPagination, RouterLink, TuiDataList, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule, TuiButton, TuiTextfield, TuiInputNumberModule, TuiNumberFormat,
    TuiFiles, TuiIcon, AsyncPipe, NgIf, TuiDropdown, 
  ],
  templateUrl: './all-cards.component.html',
  styleUrl: './all-cards.component.css'
})
export class AllCardsComponent {
  private readonly alerts = inject(TuiAlertService);
  public imagePrefix: string = "https://cardcollecting.blob.core.windows.net/images/";
  defaultImage: string = "no-image-pexels-stock.jpg";
  addedName: string = '';
  createCard: FormGroup;
  cardService: CardService = inject(CardService);
  accountService: AccountServiceService = inject(AccountServiceService);
  collectionService: CollectionService = inject(CollectionService);
  public cards: Card[] = [];
  public length: number = 0;
  public tmp!: string[];
  public types!: string[];
  filteredCards: Card[] = [];
  constructor(private fb: FormBuilder) {
    ChangeDetectorRef; this.createCard = this.fb.group({
      name: [, [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      series: [, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      type: [, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      faction: [, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      subtype: [, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      loyalty: [0, [Validators.required, Validators.min(0)]],
      attack: [0, [Validators.required, Validators.min(-20)]],
      defense: [0, [Validators.required, Validators.min(-20)]],
      ruleText: [, [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      description: [, [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      artist: [, [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
      source: [, [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
      licence: [, [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
    });
  }

  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.cardService.getAllCards().subscribe(data => {
      this.cards = data;
      this.length = Math.ceil(this.cards.length / 10);
      this.tmp = this.cards.map(card => card.type);
      this.filteredCards = this.cards;
      this.types = [...new Set(this.tmp)];
      this._ref.detectChanges();
    });
  }

  dropdownList = [];
  dropdownSettings = {};
  selectedTypes!: string[];
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

  sortType: string = 'id'
  pageSize: number = 10;
  protected indx = 0;
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

  private readonly confirm = inject(TuiConfirmService);
  private readonly dialogs = inject(TuiDialogService);
  protected value = '';
  protected onModelChange(value: string): void {
    this.value = value;
    this.confirm.markAsDirty();
  }
  protected showDialog(content: PolymorpheusContent<TuiDialogContext>, id: number, quantity: number): void {
    this.value = quantity.toString();
    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          this.addCardToCollection(id, parseInt(this.value));
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
          this.addedName = this.cards.find(card => card.id == id)?.name || '';
          this.alerts.open(`<p>${this.addedName} has been added to your collection in quantity of: ${quantity}</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.check' }).subscribe();
        },
        error: (error) => {
          this.alerts.open(`<p>Couldn't change quantity</p>`, { label: 'An error ocurred!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
        },
      });
    }
  }

  protected showCreateDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          this.createCardRequest();
        }
      },
    });
  }

  protected createCardRequest(): void {
    let name = this.createCard.value.name;
    let series = this.createCard.value.series;
    let type = this.createCard.value.type;
    let faction = this.createCard.value.faction;
    let subtype = this.createCard.value.subtype;
    let cost = this.createCard.value.cost;
    let loyalty = this.createCard.value.loyalty;
    let attack = this.createCard.value.attack;
    let defense = this.createCard.value.defense;
    let ruleText = this.createCard.value.ruleText;
    let description = this.createCard.value.description;
    let artist = this.createCard.value.artist;
    let source = this.createCard.value.source;
    let licence = this.createCard.value.licence;
    let request: ICreateCardRequest = { name, series, type, faction, subtype, cost, loyalty, attack, defense, ruleText, description, artist, source, licence };
    this.cardService.createCard(request).subscribe({
      next: (result) => {
        this.confirm.markAsDirty();
        this.cards.push(result);
        this.filteredCards = this.cards;
        this.length = Math.ceil(this.filteredCards.length / 10);
        this.sortType = '';
        this.sortId();
        this.alerts.open(`<p>Card succesfully created</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.pencil' }).subscribe();
        this._ref.detectChanges();
      }, error: (error) => {
        this.alerts.open(`<p>Couldn't create card</p>`, { label: 'An error ocurred!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      }
    });
  }

  protected showEditCardDialog(content: PolymorpheusContent<TuiDialogContext>, cardId: number): void {
    var card = this.cards.find(card => card.id == cardId);
    if (!card) {
      this.alerts.open(`<p>Couldn't find card</p>`, { label: 'An error ocurred!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      return;
    }
    this.createCard.setValue({
      name: card.name,
      series: card.series,
      type: card.type,
      faction: card.faction,
      subtype: card.subtype,
      cost: card.cost,
      loyalty: card.loyalty,
      attack: card.attack,
      defense: card.defense,
      ruleText: card.ruleText,
      description: card.description,
      artist: card.artist,
      source: card.source,
      licence: card.licence
    });
    this.dialogs.open<string>(content).subscribe({
      next: (result) => {
        if (result) {
          var card = this.cards.find(card => card.id == cardId);
          if (!card) {
            return;
          }
          if (
            card.name !== this.createCard.value.name ||
            card.series !== this.createCard.value.series ||
            card.type !== this.createCard.value.type ||
            card.faction !== this.createCard.value.faction ||
            card.subtype !== this.createCard.value.subtype ||
            card.cost !== this.createCard.value.cost ||
            card.loyalty !== this.createCard.value.loyalty ||
            card.attack !== this.createCard.value.attack ||
            card.defense !== this.createCard.value.defense ||
            card.ruleText !== this.createCard.value.ruleText ||
            card.description !== this.createCard.value.description ||
            card.artist !== this.createCard.value.artist ||
            card.source !== this.createCard.value.source ||
            card.licence !== this.createCard.value.licence
          ) {
            let editedCard: Card = new Card(
              cardId, this.createCard.value.name,
              this.createCard.value.series, this.createCard.value.type,
              this.createCard.value.faction, this.createCard.value.subtype,
              this.createCard.value.cost, this.createCard.value.loyalty,
              this.createCard.value.attack, this.createCard.value.defense,
              this.createCard.value.ruleText, this.createCard.value.description,
              this.createCard.value.artist, this.createCard.value.source,
              this.createCard.value.licence
            );
            this.editCardRequest(editedCard);
          }
        }
      }
    });
  }

  protected editCardRequest(editedCard: Card) {
    this.cardService.editCard(editedCard).subscribe({
      next: (response) => {
        this.cards = this.cards.map(card => card.id == editedCard.id ? editedCard : card);
        this.filteredCards = this.filteredCards.map(card => card.id == editedCard.id ? editedCard : card);
        this.alerts.open(`<p>Card succesfully edited</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.pencil' }).subscribe();
        this.confirm.markAsDirty();
        this._ref.detectChanges();
      }, error: (error) => {
        this.alerts.open(`<p>Couldn't edit card</p>`, { label: 'An error ocurred!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
      }
    });
  }

  protected showDeleteDialog(content: PolymorpheusContent<TuiDialogContext>, cardId: number): void {
    this.dialogs
      .open<boolean>(content
      )
      .subscribe({
        next: (value) => {
          if (!value) return;
          this.cardService.deleteCard(cardId).subscribe({
            next: () => {
              this.cards = this.cards.filter(card => card.id != cardId);
              this.filteredCards = this.filteredCards.filter(card => card.id != cardId);
              this.length = Math.ceil(this.filteredCards.length / 10);
              this.alerts.open(`<p>Card succesfully deleted</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.trash' }).subscribe();
              this.confirm.markAsDirty();
              this._ref.detectChanges();
            }, error: (error) => {
              this.alerts.open(`<p>Couldn't delete card</p>`, { label: 'An error ocurred!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
            }
          });
        }
      });
  }

  //taiga ui template code adjusted below
  protected readonly imageControl = new FormControl<TuiFileLike | null>(
    null,
    Validators.required,
  );
  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadedFiles$ = this.imageControl.valueChanges.pipe(
    switchMap((file) => this.processFile(file)),
  );

  protected removeFile(): void {
    this.imageControl.setValue(null);
  }

  protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);

    if (this.imageControl.invalid || !file) {
      return of(null);
    }

    this.loadingFiles$.next(file);

    return timer(500).pipe(
      map(() => {
        if (file) {
          return file;
        }
        this.failedFiles$.next(file);
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }

  protected showAddImageDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs
      .open<boolean>(content
      )
      .subscribe({
        next: (value) => {
          if (!value) {
            this.removeFile();
            this.imageControl.markAsUntouched();
            this._ref.detectChanges();
            return;
          }
          const file = this.imageControl.value as File;
          if (!file) {
            return;
          }
          this.cardService.addImage(file).subscribe({
            next: (response) => {
              this.alerts.open(`<p>Image succesfully added</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.image' }).subscribe();
            }, error: (error) => {
              this.alerts.open(`<p>Couldn't upload image</p>`, { label: 'An error ocurred!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
            }

          });
          this.removeFile();
          this.imageControl.markAsUntouched();
          this._ref.detectChanges();
        }
      });
  }

  protected showRemoveImageDialog(content: PolymorpheusContent<TuiDialogContext>, cardName: string): void {
    this.dialogs
      .open<boolean>(content
      )
      .subscribe({
        next: (value) => {
          if (!value) return;
          this.cardService.removeImage(cardName).subscribe({
            next: () => {
              this.alerts.open(`<p>Card image succesfully deleted</p>`, { label: 'Success!', appearance: 'info', icon: '@tui.trash' }).subscribe();
            }
            , error: (error) => {
              this.alerts.open(`<p>Couldn't delete card image</p>`, { label: 'An error ocurred!', appearance: 'negative', icon: '@tui.circle-x' }).subscribe();
            }
          });
        }
      });
  }
  useDefaultImage(e: Event){
    const img = e.target as HTMLImageElement;
    img.src = this.defaultImage;
  }
}
