import { gql } from 'apollo-angular-boost';
import { UserFragment, ChatFragment } from './fragments';

export const getChat = gql`
  query getChat {
    getChat
  }
`;

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
