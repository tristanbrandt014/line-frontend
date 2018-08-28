import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import { getChats as getChatsGQL } from '../graphql/queries';
import {
  newMessage as newMessageGQL,
  INewMessageSubscription,
  newChat as newChatGQL,
  INewChatSubscription
} from '../graphql/subscriptions';
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
  queryRef: QueryRef<IResponse, IChatListVariables>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.queryRef = this.apollo.watchQuery({
      query: getChatsGQL,
      variables: {
        filters: {
          mine: true
        }
      },
      fetchPolicy: 'network-only'
    });

    this.query = this.queryRef.valueChanges.subscribe(
      ({ data, loading }) => {
        this.loading = loading;
        this.chats = [...data.getChats.results].sort((a, b) => {
          const getLatestTimestamp = (chat: IChat) =>
            [...chat.messages].reverse()[0].timestamp;
          const latestA = getLatestTimestamp(a);
          const latestB = getLatestTimestamp(b);
          return latestB - latestA;
        });
        this.total = data.getChats.total;
      },
      error => {
        console.log(error);
      }
    );
    this.subscribeToNewMessages();
    this.subscribeToNewChats();
  }

  subscribeToNewMessages() {
    this.queryRef.subscribeToMore({
      document: newMessageGQL,
      variables: {
        token: localStorage.getItem('id_token')
      },
      updateQuery: (prev: IResponse, { subscriptionData }): IResponse => {
        const result = subscriptionData as INewMessageSubscription;
        const oldChat = prev.getChats.results.find(
          chat => chat.id === result.data.newMessage.chatId
        );
        const newChats = prev.getChats.results.filter(
          chat => chat.id !== result.data.newMessage.chatId
        );
        const updatedChat: IChat = {
          ...oldChat,
          messages: [...oldChat.messages]
        };
        updatedChat.messages.push(result.data.newMessage.message);
        return {
          ...prev,
          getChats: {
            ...prev.getChats,
            results: [...newChats, updatedChat]
          }
        };
      }
    });
  }

  subscribeToNewChats() {
    this.queryRef.subscribeToMore({
      document: newChatGQL,
      variables: {
        token: localStorage.getItem('id_token')
      },
      updateQuery: (prev: IResponse, { subscriptionData }): IResponse => {
        const result = subscriptionData as INewChatSubscription;
        return {
          ...prev,
          getChats: {
            ...prev.getChats,
            total: prev.getChats.total + 1,
            results: [...prev.getChats.results, result.data.newChat]
          }
        };
      }
    });
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
      if (!this.isMessageMine(chat, message) && !message.read) {
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
