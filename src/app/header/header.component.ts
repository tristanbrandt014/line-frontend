import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToggleSidebar } from '../sidebar.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private store: Store) {}

  openSidebar() {
    this.store.dispatch(new ToggleSidebar(true));
  }

  ngOnInit() {}
}
