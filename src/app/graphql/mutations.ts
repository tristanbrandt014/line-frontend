import { gql } from 'apollo-angular-boost';
import { UserFragment, ChatFragment, MessageFragment } from './fragments';

export const login = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        ...UserFragment
      }
      token
      expiresIn
    }
  }
  ${UserFragment}
`;

export const register = gql`
  mutation createUser(
    $username: String!
    $password: String!
    $displayName: String
  ) {
    createUser(
      username: $username
      password: $password
      displayName: $displayName
    ) {
      user {
        ...UserFragment
      }
      token
      expiresIn
    }
  }
  ${UserFragment}
`;

export const createChat = gql`
  mutation createChat($userId: String!, $message: String!) {
    createChat(userId: $userId, message: $message) {
      ...ChatFragment
    }
  }
  ${UserFragment}
  ${MessageFragment}
  ${ChatFragment}
`;

export const sendMessage = gql`
  mutation sendMessage($message: String!, $chatId: String!) {
    sendMessage(message: $message, chatId: $chatId) {
      ...MessageFragment
    }
  }
  ${MessageFragment}
  ${UserFragment}
`;

export const markRead = gql`
  mutation markRead($chatId: String!) {
    markRead(chatId: $chatId)
  }
`;
