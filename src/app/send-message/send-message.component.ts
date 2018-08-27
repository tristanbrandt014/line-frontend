import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NewChat } from '../new-chat/new-chat.model';
import { Apollo } from 'apollo-angular';
import { sendMessage as sendMessageGQL } from '../graphql/mutations';
import { getChatWithUser as getChatWithUserGQL } from '../graphql/queries';
import {
  IMessage,
  IChatVariables,
  IChatWithUserResult
} from '../../types/chat';
import { Subscription } from 'rxjs';
import { IUser } from '../../types';
import * as zenscroll from 'zenscroll';

interface IResult {
  sendMessage: IMessage;
}

interface IVariables {
  chatId: string;
  message: string;
}
@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, OnDestroy {
  @Input()
  id: string;

  @Input()
  me: IUser;

  query: Subscription;
  model = new NewChat('');
  constructor(private apollo: Apollo) {}

  scrollChat() {
    const div = document.getElementById('messages-container');
    try {
      const scroller = zenscroll.createScroller(div);
      scroller.toY(div.scrollHeight);
    } catch (e) {}
  }

  handleSubmit(e) {
    this.query = this.apollo
      .mutate<IResult, IVariables>({
        mutation: sendMessageGQL,
        variables: {
          message: this.model.message,
          chatId: this.id
        },
        optimisticResponse: {
          __typename: 'Mutation',
          sendMessage: {
            __typename: 'Message',
            content: this.model.message,
            from: this.me,
            read: false
          }
        },
        update: (store, { data }) => {
          const response = data as IResult;
          try {
            const chatData = store.readQuery<
              IChatWithUserResult,
              IChatVariables
            >({
              query: getChatWithUserGQL,
              variables: {
                conditions: {
                  id: this.id
                }
              }
            });
            chatData.getChat.messages.push(response.sendMessage);
            store.writeQuery({ query: getChatWithUserGQL, data: chatData });
            this.scrollChat();
          } catch (e) {
            // pass
          }
        }
      })
      .subscribe(({ data }) => {}, error => console.log(error));
    this.model.message = '';
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.query) {
      this.query.unsubscribe();
    }
  }
}
