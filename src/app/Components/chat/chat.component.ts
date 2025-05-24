import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IMessage, Message } from '../../Classes/message';
import { IMessagedUsers } from '../../Classes/messagedUsersResponse';
import { TuiIcon } from '@taiga-ui/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { AccountServiceService } from '../../Services/account-service.service';
import { TuiAvatar } from '@taiga-ui/kit';
import { ChatService } from '../../Services/chat.service';
@Component({
  selector: 'app-chat',
  imports: [TuiIcon, NgFor, ReactiveFormsModule, FormsModule, TuiAvatar, DatePipe, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @Input() messagesWithUser: IMessage[] = [];
  @Input() messagedUser!: IMessagedUsers;
  @Output() updateMessagesEvent = new EventEmitter<Message>();
  accountService: AccountServiceService = inject(AccountServiceService);
  currentUsername = this.accountService.currentUserSignal()?.username;
  chatService: ChatService = inject(ChatService);
  sendMessage: FormGroup;
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  constructor(private fb: FormBuilder, private router: Router) {
    this.sendMessage = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(256)]],
    });
  }
  ngOnInit() {
  }
  onSubmit() {
    if (this.sendMessage.valid) {
      let receiverId = this.messagedUser.userId;
      let request = { content: this.sendMessage.value.content, receiverId: receiverId };
      this.chatService.sendMessage(request).subscribe({
        next: (response) => {
          this.messagesWithUser.push(new Message(response.id, response.authorId, response.authorName, response.receiverId, response.content, new Date(response.messageDate)));
        },
        error: (error) => {
          console.log('Message failed to send', error);
        },
      });
      this.sendMessage.reset();
    }
  }
  //I use this to post date above message only if they are more than 10 minutes apart
  dateTenMinutesApart(date1: Date, date2: Date): boolean {
    let result = Math.abs(date1.getTime() - date2.getTime());
    if (result < 0) {
      return false;
    }
    return result < 600000;
  }

  scrollToBottom() {
    if (document.getElementById('messages') != null) {
      var height = document.getElementById('messages')?.scrollHeight;
      if (height != null)
        document.getElementById('messages')?.scrollTo(0, height);
    }
  }
}
