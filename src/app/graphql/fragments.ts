import { gql } from 'apollo-angular-boost';

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    username
    displayName
  }
`;
