import { Component, OnInit } from '@angular/core';
import { IUser } from '../../types';
import { Apollo, gql } from 'apollo-angular-boost';
import { GraphQLError } from 'graphql';

interface IResponse {
  getUsers: IUser[];
}

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})

export class TestComponentComponent implements OnInit {
  users: IUser[];
  loading: boolean;
  errors: GraphQLError[];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<IResponse>({
        query: gql`
          query getUsers {
            getUsers {
              id
              username
              displayName
            }
          }
        `
      })
      .valueChanges.subscribe(result => {
        this.users = result.data && result.data.getUsers;
        this.loading = result.loading;
        this.errors = result.errors;
      });
  }
}
