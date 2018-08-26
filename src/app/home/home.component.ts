import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { getUsers as getUsersGQL } from '../graphql/queries';
import { IListResult } from '../../types/list';
import { IUser, IUserListVariables } from '../../types';

interface IResponse {
  getUsers: IListResult<IUser>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  loading = true;
  users: IUser[];

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<IResponse, IUserListVariables>({
        query: getUsersGQL,
        variables: {
          filters: {
            onlyOthers: true
          }
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;
          this.users = data.getUsers.results;
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
