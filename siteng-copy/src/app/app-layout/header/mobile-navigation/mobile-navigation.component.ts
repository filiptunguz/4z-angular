import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {AuthService} from "../../../auth/services/auth.service";
import {Observable} from "rxjs";
import {User} from "../../../auth/me.context";
import {LetModule} from "@rx-angular/template";
import {DesktopNavigationComponent} from "../desktop-navigation/desktop-navigation.component";
import {MatIconModule} from "@angular/material/icon";
import {RouterLinkWithHref} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {GtagAction, GtagService} from "../../../misc/services/gtag.service";
import {PlatformService} from "../../services/platform.service";
import {CdnPipe} from "../../pipes/cdn.pipe";

enum Sidenav {
  myAds = -1,
  closed = 0,
  main = 1,
  profile = 2,
  sale = 3,
  rent = 4,
  newBuilding = 5,
  advertisement = 6,
}

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [CommonModule, LetModule, DesktopNavigationComponent, MatIconModule, RouterLinkWithHref, MatToolbarModule, MatButtonModule, NgOptimizedImage, CdnPipe],
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileNavigationComponent {
  private authService = inject(AuthService);
  private gtag = inject(GtagService);
  private platform = inject(PlatformService);

  user$: Observable<User | null>;

  activeSidenav: Sidenav = Sidenav.closed;

  constructor() {
    this.user$ = this.authService.user$;
  }

  closeSidenav(gtagLabel?: string, eventAction: GtagAction = 'click') {
    this.activeSidenav = Sidenav.closed;
    this.platform.setBodyNoScroll(false);

    if (gtagLabel) this.sendEvent(eventAction, gtagLabel);
  }

  sendEvent(action: GtagAction, label: string) {
    this.gtag.event(action, 'NavMenuMobile', label);
  }

  showProfileSidenav() {
    this.activeSidenav = Sidenav.myAds;
    this.sendEvent('click', 'Zaglavlje');
  }

  showMainSidenav(gtagLabel?: string) {
    this.activeSidenav = Sidenav.main;
    this.platform.setBodyNoScroll(true);

    if (gtagLabel) this.sendEvent('click', gtagLabel);
  }
}
