import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from "../../../auth/services/auth.service";
import {Observable} from "rxjs";
import {User} from "../../../auth/me.context";
import {LetModule} from "@rx-angular/template";
import {DesktopNavigationComponent} from "../desktop-navigation/desktop-navigation.component";

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [CommonModule, LetModule, DesktopNavigationComponent],
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileNavigationComponent {
  authService = inject(AuthService);

  user$: Observable<User | null>;

  constructor() {
    this.user$ = this.authService.user$;
  }
}
