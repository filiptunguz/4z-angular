import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from "../../auth/me.context";
import {RxState} from "@rx-angular/state";

interface State {
  user: User | null;
}

@Injectable({
  providedIn: 'root',
})
export class StateService extends RxState<State> {
  user$: Observable<User | null> = this.select('user');

  setUser(user: User | null) {
    this.set('user', () => user);
  }
}
