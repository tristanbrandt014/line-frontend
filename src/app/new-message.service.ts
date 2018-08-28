import { Injectable } from '@angular/core';
import { Subscription } from 'apollo-angular';
import { newMessage as newMessageGQL } from './graphql/subscriptions';

@Injectable({
  providedIn: 'root'
})
export class NewMessageService extends Subscription {
  document = newMessageGQL;
}
