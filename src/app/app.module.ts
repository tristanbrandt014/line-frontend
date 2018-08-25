import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { ButtonComponent } from './button/button.component';
import { LoaderComponent } from './loader/loader.component';
import { FormsModule } from '@angular/forms';
import { ErrorListComponent } from './error-list/error-list.component';
import { HomeComponent } from './home/home.component';

import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent,
    LoginComponent,
    ButtonComponent,
    LoaderComponent,
    ErrorListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ApolloModule
  ],
  providers: [HttpLink],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({ uri: 'http://localhost:4000/graphql' });

    const ws = new WebSocketLink({
      uri: `ws://localhost:4000/graphql`,
      options: {
        reconnect: true
      }
    });

    const auth = setContext((_, { headers }) => {
      const token = localStorage.getItem('id_token');
      if (!token) {
        return {};
      } else {
        return {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
      }
    });

    const link = split(
      // split based on operation type
      ({ query }) => {
        // Not sure what the issue is here. Maybe versions are not correct
        // @ts-ignore
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      ws,
      http
    );

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache()
      // other options like cache
    });
  }
}
