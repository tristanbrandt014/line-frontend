export class Register {
  constructor(
    public username: string,
    public password: string,
    public displayName: string
  ) {}

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
    const minLength = 6;
    const requireUpper = true;
    const requireLower = true;
    const requireNumber = true;

    const errors = [];

    if (!this.password) {
      errors.push('password is required');
    }

    if (this.password.length < minLength) {
      errors.push(`password must be at least ${minLength} characters.`);
    }

    if (requireLower) {
      if (!/[a-z]/.test(this.password)) {
        errors.push('password must contain at least one lowercase letter.');
      }
    }

    if (requireUpper) {
      if (!/[A-Z]/.test(this.password)) {
        errors.push('password must contain at least one uppercase letter.');
      }
    }

    if (requireNumber) {
      if (!/[0-9]/.test(this.password)) {
        errors.push('password must contain at least one number.');
      }
    }

    return errors;
  }
}
