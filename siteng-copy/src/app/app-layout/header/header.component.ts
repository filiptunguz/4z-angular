import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {MobileNavigationComponent} from "./mobile-navigation/mobile-navigation.component";
import {DesktopNavigationComponent} from "./desktop-navigation/desktop-navigation.component";
import {MobileLgRenderDirective} from "../directives/mobile-lg-render.directive";
import {DesktopLgRenderDirective} from "../directives/desktop-lg-render.directive";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    DesktopLgRenderDirective,
    DesktopNavigationComponent,
    MobileLgRenderDirective,
    MobileNavigationComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements AfterViewInit {
  changeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    // this.changeDetectorRef.detach();
  }
}
