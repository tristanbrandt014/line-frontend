import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';

// See https://blog.angular-university.io/angular-jwt-authentication/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  public setSession(token: string, expiresIn: number) {
    const expiresAt = moment().add(expiresIn, 'second');

    localStorage.setItem('id_token', token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    this.apollo.getClient().cache.reset();
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isAuthenticated() {
    const expiration = this.getExpiration();
    if (!expiration) {
      return false;
    }
    return moment().isBefore(expiration);
  }

  isLoggedOut() {
    return !this.isAuthenticated();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (!expiration) {
      return false;
    }
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
