import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { getChatWithUser as getChatWithUserGQL } from '../graphql/queries';
import {
  newMessage as newMessageGQL,
  INewMessageSubscription
} from '../graphql/subscriptions';
import { markRead as markReadGQL } from '../graphql/mutations';
import { Apollo, QueryRef } from 'apollo-angular';
import { IChat, IChatWithUserResult, IChatVariables } from '../../types/chat';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from '../../types';
import * as zenscroll from 'zenscroll';
import { NewMessageService } from '../new-message.service';

interface IMarkReadResult {
  markRead: boolean;
}

interface IMarkReadVariables {
  chatId: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: IChat;
  loading = true;
  query: Subscription;
  queryRef: QueryRef<IChatWithUserResult, IChatVariables>;
  routeSubscription: Subscription;
  id: string;
  me: IUser;
  newMessageSubscription: Subscription;

  @ViewChild('messagesContainer')
  private messagesContainer: ElementRef;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private newMessageService: NewMessageService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params.id;
        this.queryRef = this.apollo.watchQuery({
          query: getChatWithUserGQL,
          variables: {
            conditions: {
              id: this.id
            }
          },
          fetchPolicy: 'network-only'
        });
        this.query = this.queryRef.valueChanges.subscribe(
          ({ data, loading }) => {
            this.chat = data.getChat;
            this.me = data.getMe;
            this.loading = loading;
            this.apollo
              .mutate<IMarkReadResult, IMarkReadVariables>({
                mutation: markReadGQL,
                variables: {
                  chatId: this.id
                }
              })
              .toPromise();
            if (!this.loading) {
              setTimeout(() => this.scroll(), 50);
            }
          }
        );
        this.subscribeToNewMessages();
      });
    const token = localStorage.getItem('id_token');
  }

  subscribeToNewMessages() {
    this.queryRef.subscribeToMore({
      document: newMessageGQL,
      variables: {
        token: localStorage.getItem('id_token')
      },
      updateQuery: (
        prev: IChatWithUserResult,
        { subscriptionData }
      ): IChatWithUserResult => {
        const result = subscriptionData as INewMessageSubscription;
        const isChat = result.data.newMessage.chatId === prev.getChat.id;
        const isValidMessage = !prev.getChat.messages.find(
          message => message.id === result.data.newMessage.message.id
        );
        const shouldAddMessage = isChat && isValidMessage;
        return {
          ...prev,
          getChat: {
            ...prev.getChat,
            messages: [
              ...prev.getChat.messages,
              ...(shouldAddMessage ? [result.data.newMessage.message] : [])
            ]
          }
        };
      }
    });
  }

  scroll = () => {
    try {
      const scroller = zenscroll.createScroller(
        this.messagesContainer.nativeElement
      );
      scroller.toY(this.messagesContainer.nativeElement.scrollHeight, 200);
    } catch (err) {}
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.query.unsubscribe();
  }
}
