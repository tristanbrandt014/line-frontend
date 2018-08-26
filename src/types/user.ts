export interface IUser {
  id: string;
  username: string;
  displayName: string;
}

export interface ILoginVariables {
  username: string;
  password: string;
}

export interface IRegisterVariables extends ILoginVariables {
  displayName: string;
}

export interface IUserWithToken {
  user: IUser;
  token: string;
  expiresIn: number;
}

export interface IUserListFilters {
  onlyOthers: boolean;
}

export interface IUserListVariables {
  offset?: number;
  first?: number;
  filters: IUserListFilters;
}
