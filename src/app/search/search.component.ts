import { Component, OnInit } from '@angular/core';
import { Search } from './search.model';
import { searchChatWithUser as searchChatWithUserGQL } from '../graphql/queries';
import { Apollo } from 'apollo-angular';
import { Subscription, Subject } from 'rxjs';
import { IChat, IMessage } from '../../types/chat';
import { IUser } from '../../types';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';

interface ISearchResult {
  chat: IChat;
  matches: IMessage[];
}

interface IResponse {
  searchChats: ISearchResult[];
  getMe: IUser;
}
interface IVariables {
  term: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  model = new Search('');
  query: Subscription;
  me: IUser;
  results: ISearchResult[];
  loading: boolean;
  term: string;
  private searchTerms = new Subject<string>();
  response$: Observable<ApolloQueryResult<IResponse>>;

  constructor(private apollo: Apollo) {}

  search(term: string): void {
    if (term) {
      this.searchTerms.next(term);
    } else {
    }
  }

  clearSearch() {
    this.model.term = '';
  }

  ngOnInit() {
    this.searchTerms.pipe(distinctUntilChanged()).subscribe(term => {
      this.loading = true;
    });
    this.response$ = this.searchTerms.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(
        (term: string) =>
          this.apollo.watchQuery<IResponse, IVariables>({
            query: searchChatWithUserGQL,
            variables: {
              term
            }
          }).valueChanges
      )
    );
    this.response$.subscribe(({ data, loading }) => {
      this.loading = loading;
      this.me = data.getMe;
      this.results = data.searchChats;
    });
  }
}
