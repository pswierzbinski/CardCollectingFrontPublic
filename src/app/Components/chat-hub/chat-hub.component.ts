import { ChangeDetectorRef, Component, inject, Output } from '@angular/core';
import { ChatComponent } from "../chat/chat.component";
import { ChatService } from '../../Services/chat.service';
import { AccountServiceService } from '../../Services/account-service.service';
import { IMessagedUsers } from '../../Classes/messagedUsersResponse';
import { IMessage, Message } from '../../Classes/message';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-chat-hub',
  imports: [ChatComponent, RouterLink, NgFor, TuiAvatar, TuiIcon],
  templateUrl: './chat-hub.component.html',
  styleUrl: './chat-hub.component.css'
})
export class ChatHubComponent {
  accountService: AccountServiceService = inject(AccountServiceService);
  chatService: ChatService = inject(ChatService);
  userName!: string;
  @Output() messagedUsers: IMessagedUsers[] = [];
  @Output() messagesWithUser: IMessage[] = [];
  @Output() messagingUser!: IMessagedUsers;
  _ref: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.userName = params.get('userName')!;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    if (this.userName != null && this.userName != undefined && this.userName != ' ') {
      this.chatService.getMessagesWithUser(this.userName).subscribe({
        next: (response) => {
          for (let i = 0; i < response.length; i++) {
            this.messagesWithUser.push(new Message(response[i].id, response[i].authorId, response[i].authorName, response[i].receiverId, response[i].content, new Date(response[i].messageDate)));
          }
        },
        error: (error) => {
        },
      });
      this.accountService.getUserIdByName(this.userName).subscribe({
        next: (response) => {
          if (response) {
            let userId = response.id;
            this.messagingUser = { userId: userId, userName: this.userName };
          }
        },
        error: (error) => {
          console.log('User not found', error);
        },
      });
    }
    this.chatService.getMessagedUsers().subscribe({
      next: (response) => {
        this.messagedUsers = response;
      },
      error: (error) => {
        console.log('Couldn\'t get messaged users', error);
      },
    });
    this._ref.detectChanges();
  }


  updateMessagesEvent(event: Message): void {
    this.messagesWithUser.push(event);
    this._ref.detectChanges();
  }

  checkIfUserPreviouslyMessaged(): boolean {
    if (this.messagedUsers == null || this.messagedUsers == undefined || this.messagedUsers.length == 0) {
      return false;
    }
    for (let i = 0; i < this.messagedUsers.length; i++) {
      if (this.messagedUsers[i].userName == this.userName) {
        return true;
      }
    }
    return false;
  }
  addMessagedUser(): void {
    if (!this.checkIfUserPreviouslyMessaged()) {
      this.messagedUsers.push(this.messagingUser);
      this._ref.detectChanges();
    }
  }
}
