import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardComment } from '../../Classes/cardComment';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiIcon } from '@taiga-ui/core';
import { AccountServiceService } from '../../Services/account-service.service';

@Component({
  selector: 'app-card-comment',
  imports: [TuiAvatar, TuiIcon],
  templateUrl: './card-comment.component.html',
  styleUrl: './card-comment.component.css'
})

export class CardCommentComponent {
  @Input() cardComment!: CardComment;
  accountService = inject(AccountServiceService);
  @Output() deleteEvent = new EventEmitter<number>();

  deleteComment() {
    this.deleteEvent.emit(this.cardComment.id);
  }
}
