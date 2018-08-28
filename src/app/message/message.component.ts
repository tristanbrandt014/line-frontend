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

  @Input()
  term: string;

  isMe: boolean;

  highlight(term: string, content: string) {
    if (!term) {
      return content;
    }
    return content.replace(new RegExp(term, 'gi'), match => {
      return '<span class="highlight">' + match + '</span>';
    });
  }

  constructor() {}

  ngOnInit() {
    this.isMe = this.message.from.id === this.me.id;
  }
}
