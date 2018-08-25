import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloBoostModule, ApolloBoost } from 'apollo-angular-boost';

import { AppComponent } from './app.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [AppComponent, TestComponentComponent, LoginComponent, InputComponent, ButtonComponent],
  imports: [BrowserModule, HttpClientModule, ApolloBoostModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(boost: ApolloBoost) {
    boost.create({
      uri: 'http://localhost:4000/graphql'
    });
  }
}
