import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {AuthService} from "../../../auth/services/auth.service";
import {Observable} from "rxjs";
import {User} from "../../../auth/me.context";
import {LetModule} from "@rx-angular/template";

@Component({
  selector: 'app-desktop-navigation',
  standalone: true,
  imports: [LetModule, JsonPipe],
  templateUrl: './desktop-navigation.component.html',
  styleUrls: ['./desktop-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopNavigationComponent {
  authService = inject(AuthService);

  user$: Observable<User | null>;

  constructor() {
    this.user$ = this.authService.user$;
  }
}
