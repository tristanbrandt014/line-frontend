import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular-boost';
import { login as loginGQL } from '../graphql/mutations';
import { Login } from './login.model';
import { ILoginVariables, IUserWithToken } from '../../types';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  model = new Login('', '');
  errors: string[] = [];
  loading = false;
  passwordError = false;
  usernameError = false;
  query: Subscription;

  constructor(
    private apollo: Apollo,
    private auth: AuthService,
    public router: Router
  ) {}

  handleSubmit(e) {
    const validationResult = this.model.validate();
    this.errors = validationResult.errors;
    this.passwordError = !!validationResult.passwordErrors.length;
    this.usernameError = !!validationResult.usernameErrors.length;

    if (validationResult.success) {
      this.loading = true;
      this.query = this.apollo
        .mutate<IUserWithToken, ILoginVariables>({
          mutation: loginGQL,
          variables: {
            ...this.model
          }
        })
        .subscribe(
          ({ data }) => {
            const result = data.loginUser as IUserWithToken;
            this.auth.setSession(result.token, result.expiresIn);
            this.router.navigate(['']);
            this.loading = false;
          },
          error => {
            this.errors = ['authentication failed'];
            this.loading = false;
          }
        );
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.query) {
      this.query.unsubscribe();
    }
  }
}
