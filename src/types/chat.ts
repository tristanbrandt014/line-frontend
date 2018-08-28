import { IUser } from './user';

export interface IChat {
  id: string;
  users?: IUser[];
  messages: IMessage[];
  other: IUser;
}

export interface IMessage {
  id: string;
  from: IUser;
  content: string;
  read: boolean;
  timestamp: number;
}

export interface IChatListFilters {
  mine?: boolean;
}

export interface IChatListVariables {
  offset?: number;
  first?: number;
  filters: IChatListFilters;
}

export interface IChatConditions {
  id?: string;
  userId?: string;
}

export interface IChatWithUserResult {
  getChat: IChat;
  getMe: IUser;
}

export interface IChatVariables {
  conditions: IChatConditions;
}
