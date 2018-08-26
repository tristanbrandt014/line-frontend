import { Component, OnInit, OnDestroy } from '@angular/core';
import { getUsers as getUsersGQL } from '../graphql/queries';
import { Apollo } from 'apollo-angular-boost';
import { Subscription } from 'rxjs';
import { IUser, IUserListVariables } from '../../types';

interface IResponse {
  getUsers: {
    total: number;
    results: IUser[];
  };
}

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, OnDestroy {
  loading = true;
  query: Subscription;
  users: IUser[];
  total: number;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo
      .watchQuery<IResponse, IUserListVariables>({
        query: getUsersGQL,
        variables: {
          filters: {
            onlyOthers: true
          }
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        this.users = data.getUsers.results;
        this.total = data.getUsers.total;
      });
  }

  ngOnDestroy() {
    this.query.unsubscribe();
  }
}
