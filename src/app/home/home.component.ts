import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { getChat as getChatGQL } from '../graphql/queries';

interface IResponse {
  getChat: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  loading = false;
  currentChat: string;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<IResponse>({
        query: getChatGQL
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          console.log('something');
          this.loading = loading;
          this.currentChat = data.getChat;
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
