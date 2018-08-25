export interface IUser {
  id: string;
  username: string;
  displayName: string;
}

export interface ILoginVariables {
  username: string;
  password: string;
}

export interface IUserWithToken {
  user: IUser;
  token: string;
  expiresIn: number;
}
