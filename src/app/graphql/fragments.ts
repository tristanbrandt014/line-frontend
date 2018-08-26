import { gql } from 'apollo-angular-boost';

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    username
    displayName
  }
`;

export const ChatFragment = gql`
  fragment ChatFragment on Chat {
    id
    messages {
      from {
        ...UserFragment
      }
      content
      read
    }
  }
`;
