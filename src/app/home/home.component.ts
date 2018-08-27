import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { getChats as getChatsGQL } from '../graphql/queries';
import { IListResult } from '../../types/list';
import { IChat, IChatListVariables, IMessage } from '../../types/chat';
import { elipsify } from '../../utils';

interface IResponse {
  getChats: IListResult<IChat>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  loading = true;
  chats: IChat[];
  query: Subscription;
  total: number;
  lastMessage: IMessage;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo
      .watchQuery<IResponse, IChatListVariables>({
        query: getChatsGQL,
        variables: {
          filters: {
            mine: true
          }
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;
          this.chats = data.getChats.results;
          this.total = data.getChats.total;
        },
        error => {
          console.log(error);
        }
      );
  }

  getLastMessage(chat: IChat): string {
    const content = [...chat.messages].reverse()[0].content;
    return elipsify(content, 30);
  }

  isMessageMine(chat: IChat, message: IMessage) {
    return message.from.id !== chat.other.id;
  }

  getLastAuthor(chat: IChat): string {
    const lastMessage = [...chat.messages].reverse()[0];
    return this.isMessageMine(chat, lastMessage)
      ? 'You'
      : chat.other.displayName.split(' ')[0];
  }

  getUnreadCount(chat: IChat): number {
    return chat.messages.reduce((count, message) => {
      if (!this.isMessageMine(chat, message)) {
        count++;
      }
      return count;
    }, 0);
  }

  ngOnDestroy() {
    if (this.query) {
      this.query.unsubscribe();
    }
  }
}
