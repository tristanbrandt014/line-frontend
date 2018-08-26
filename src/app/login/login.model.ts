export class Login {
  constructor(public username: string, public password: string) {}

  validate(): {
    success: boolean;
    errors: string[];
    usernameErrors: string[];
    passwordErrors: string[];
  } {
    const usernameErrors = this.getUsernameErrors();
    const passwordErrors = this.getPasswordErrors();
    const errors = usernameErrors.concat(passwordErrors);
    return {
      success: !errors.length,
      errors,
      usernameErrors,
      passwordErrors
    };
  }

  getUsernameErrors() {
    const errors = [];
    if (!this.username) {
      errors.push('username is required');
    }
    return errors;
  }

  getPasswordErrors() {
    const errors = [];

    if (!this.password) {
      errors.push('password is required');
    }

    return errors;
  }
}
