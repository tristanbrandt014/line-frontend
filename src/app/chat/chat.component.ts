import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { getChatWithUser as getChatWithUserGQL } from '../graphql/queries';
import { Apollo } from 'apollo-angular';
import { IChat, IChatWithUserResult, IChatVariables } from '../../types/chat';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from '../../types';
import * as zenscroll from 'zenscroll';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: IChat;
  loading = true;
  query: Subscription;
  routeSubscription: Subscription;
  id: string;
  me: IUser;

  @ViewChild('messagesContainer')
  private messagesContainer: ElementRef;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSubscription = this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params.id;
        this.query = this.apollo
          .watchQuery<IChatWithUserResult, IChatVariables>({
            query: getChatWithUserGQL,
            variables: {
              conditions: {
                id: this.id
              }
            }
          })
          .valueChanges.subscribe(({ data, loading }) => {
            this.chat = data.getChat;
            this.me = data.getMe;
            this.loading = loading;
            if (!this.loading) {
              setTimeout(() => this.scroll(), 100);
            }
          });
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
