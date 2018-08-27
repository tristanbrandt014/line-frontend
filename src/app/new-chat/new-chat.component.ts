import { Component, OnInit, OnDestroy } from '@angular/core';
import { getUser as getUserGQL } from '../graphql/queries';
import { createChat as createChatGQL } from '../graphql/mutations';
import { IUser } from '../../types';
import { Apollo } from 'apollo-angular-boost';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NewChat } from './new-chat.model';
import { IChat, IChatVariables } from '../../types/chat';

interface IUserWithMyChat extends IUser {
  myChat: null | {
    id: string;
  };
}

interface IResponse {
  getUser: IUserWithMyChat;
}

interface IMutationResponse {
  createChat: IChat;
}

interface IMutationVariables {
  userId: string;
  message: string;
}

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss']
})
export class NewChatComponent implements OnInit, OnDestroy {
  loading = true;
  model = new NewChat('Hey there, wanna chat?');

  user: IUserWithMyChat;
  query: Subscription;
  id: string;
  routeSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  handleSubmit(e) {
    this.apollo
      .mutate<IMutationResponse, IMutationVariables>({
        mutation: createChatGQL,
        variables: {
          userId: this.user.id,
          message: this.model.message
        },
        update: (store, { data }) => {
          const response = data as IMutationResponse;
          console.log(response);
          try {
            const userData = store.readQuery<IResponse, IChatVariables>({
              query: getUserGQL,
              variables: {
                conditions: {
                  id: this.id
                }
              }
            });
            userData.getUser.myChat = response.createChat;
            store.writeQuery({ query: getUserGQL, data: userData });
          } catch (e) {
            // pass
          }
        }
      })
      .subscribe(
        ({ data }) => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.routeSubscription = this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params.user_id;
        this.query = this.apollo
          .watchQuery<IResponse, IChatVariables>({
            query: getUserGQL,
            variables: {
              conditions: {
                id: this.id
              }
            }
          })
          .valueChanges.subscribe(
            ({ data, loading }) => {
              this.user = data.getUser;
              if (this.user.myChat) {
                this.router
                  .navigate(['dashboard/people'])
                  .then(() =>
                    this.router.navigate([`chat/${this.user.myChat.id}`])
                  );
              }
              this.loading = loading;
            },
            error => console.log(error)
          );
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.query.unsubscribe();
  }
}
