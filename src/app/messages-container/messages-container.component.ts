import { Component, OnInit, Input } from '@angular/core';
import { IMessage } from '../../types/chat';
import { IUser } from '../../types';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.scss']
})
export class MessagesContainerComponent implements OnInit {
  @Input()
  messages: IMessage[];
  @Input()
  me: IUser;
  constructor() {}

  ngOnInit() {}
}
