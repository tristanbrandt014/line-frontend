import { IUser } from './user';

export interface IChat {
  id: string;
  users: IUser[];
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  from: IUser;
  content: string;
  read: boolean;
}
