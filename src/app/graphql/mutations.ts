import { gql } from 'apollo-angular-boost';
import { UserFragment, ChatFragment } from './fragments';

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
      users {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
  ${ChatFragment}
`;
