import { Component, OnInit, Input } from '@angular/core';
import { IMessage } from '../../types/chat';
import { IUser } from '../../types';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input()
  message: IMessage;

  @Input()
  me: IUser;

  isMe: boolean;

  constructor() {}

  ngOnInit() {
    this.isMe = this.message.from.id === this.me.id;
  }
}
