import { gql } from 'apollo-angular-boost';
import { MessageFragment, UserFragment, ChatFragment } from './fragments';
import { IMessage, IChat } from '../../types/chat';

export const newMessage = gql`
  subscription newMessage($token: String!) {
    newMessage(token: $token) {
      message {
        ...MessageFragment
      }
      chatId
    }
  }
  ${MessageFragment}
  ${UserFragment}
`;

export interface INewMessageSubscription {
  data: {
    newMessage: {
      chatId: string;
      message: IMessage;
    };
  };
}

export const newChat = gql`
  subscription newChat($token: String!) {
    newChat(token: $token) {
      ...ChatFragment
      other {
        ...UserFragment
      }
    }
  }
  ${MessageFragment}
  ${UserFragment}
  ${ChatFragment}
`;

export interface INewChatSubscription {
  data: {
    newChat: IChat;
  };
}
