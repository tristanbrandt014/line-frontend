import { gql } from 'apollo-angular-boost';
import { UserFragment } from './fragments';

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
