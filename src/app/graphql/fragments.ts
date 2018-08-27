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
      ...MessageFragment
    }
  }
`;

export const MessageFragment = gql`
  fragment MessageFragment on Message {
    from {
      ...UserFragment
    }
    content
    read
  }
`;
