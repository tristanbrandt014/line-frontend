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
import { NgxsModule } from '@ngxs/store';
import { states } from './app.state';

import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { RegisterComponent } from './register/register.component';
import { onError } from 'apollo-link-error';
import { errors } from '../utils';
import { Router } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PeopleComponent } from './people/people.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { HeaderBackComponent } from './header-back/header-back.component';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessagesContainerComponent } from './messages-container/messages-container.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent,
    LoginComponent,
    ButtonComponent,
    LoaderComponent,
    ErrorListComponent,
    HomeComponent,
    RegisterComponent,
    UserListComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    PeopleComponent,
    NewChatComponent,
    HeaderBackComponent,
    ChatComponent,
    MessageComponent,
    SendMessageComponent,
    MessagesContainerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ApolloModule,
    NgxsModule.forRoot(states)
  ],
  providers: [HttpLink],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink, router: Router) {
    const http = httpLink.create({ uri: 'http://192.168.0.153:4000/graphql' });

    const ws = new WebSocketLink({
      uri: `ws://localhost:4000/graphql`,
      options: {
        reconnect: true
      }
    });

    const subscriptionMiddleware = {
      applyMiddleware(options, next) {
        const token = localStorage.getItem('id_token');
        if (token) {
          options.token = token;
        }
        next();
      }
    };

    // @ts-ignore
    ws.subscriptionClient.use([subscriptionMiddleware]);

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

    const authErrorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
          if (message === errors.FAILED_TO_DECODE_TOKEN) {
            localStorage.removeItem('id_token');
            localStorage.removeItem('expires_at');
            router.navigate(['login']);
          }
        });
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
      link: auth.concat(authErrorLink).concat(http),
      cache: new InMemoryCache()
      // other options like cache
    });
  }
}
