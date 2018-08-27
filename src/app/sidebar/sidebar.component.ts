import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToggleSidebar, SidebarState } from '../sidebar.state';
import { Store, Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular-boost';
import { getMe as getMeGQL } from '../graphql/queries';
import { IUser } from '../../types';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface IResult {
  getMe: IUser;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Select(SidebarState)
  open$: Observable<boolean>;
  user: IUser;
  loading = true;
  query: Subscription;

  constructor(
    private store: Store,
    private apollo: Apollo,
    private router: Router,
    private auth: AuthService
  ) {}

  public async close() {
    this.store.dispatch(new ToggleSidebar(false));
  }

  public logout() {
    this.auth.logout();
    this.close();
  }

  ngOnInit() {
    this.query = this.apollo
      .watchQuery<IResult>({ query: getMeGQL })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.user = data.getMe;
          this.loading = loading;
        },
        error => console.log(error)
      );
  }

  goto(route: string) {
    this.router.navigate([route]);
    this.close();
  }

  ngOnDestroy(): void {
    if (this.query) {
      this.query.unsubscribe();
    }
  }
}
