import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular-boost';
import { register as registerGQL } from '../graphql/mutations';
import { Register } from './register.model';
import { IUserWithToken, IRegisterVariables } from '../../types';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  model = new Register('', '', '');
  errors: string[] = [];
  loading = false;
  passwordError = false;
  usernameError = false;

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
      this.apollo
        .mutate<IUserWithToken, IRegisterVariables>({
          mutation: registerGQL,
          variables: {
            ...this.model
          }
        })
        .subscribe(
          ({ data }) => {
            const result = data.createUser as IUserWithToken;
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
}
