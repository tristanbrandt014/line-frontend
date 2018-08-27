import { gql } from 'apollo-angular-boost';
import { UserFragment, ChatFragment, MessageFragment } from './fragments';

export const getUsers = gql`
  query getUsers($offset: Int, $first: Int, $filters: UserListFilters!) {
    getUsers(offset: $offset, first: $first, filters: $filters) {
      total
      results {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`;

export const getMe = gql`
  query getMe {
    getMe {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const getUser = gql`
  query getUser($conditions: UserConditions!) {
    getUser(conditions: $conditions) {
      ...UserFragment
      myChat {
        id
      }
    }
  }
  ${UserFragment}
`;

export const getChats = gql`
  query getChats($offset: Int, $first: Int, $filters: ChatListFilters!) {
    getChats(offset: $offset, first: $first, filters: $filters) {
      total
      results {
        ...ChatFragment
        other {
          ...UserFragment
        }
      }
    }
  }
  ${ChatFragment}
  ${MessageFragment}
  ${UserFragment}
`;

export const getChatWithUser = gql`
  query getChatWithUser($conditions: ChatConditions!) {
    getChat(conditions: $conditions) {
      ...ChatFragment
      other {
        ...UserFragment
      }
    }
    getMe {
      ...UserFragment
    }
  }
  ${ChatFragment}
  ${MessageFragment}
  ${UserFragment}
`;
