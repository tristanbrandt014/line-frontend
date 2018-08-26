import { State, Action, StateContext } from '@ngxs/store';

export class ToggleSidebar {
  static type = 'ToggleSidebar';

  constructor(public readonly payload: boolean) {}
}

@State<boolean>({
  name: 'open',
  defaults: false
})
export class SidebarState {
  @Action(ToggleSidebar)
  toggleSidebar(
    { setState }: StateContext<boolean>,
    { payload }: ToggleSidebar
  ) {
    setState(payload);
  }
}
