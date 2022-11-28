import {ChangeDetectionStrategy, Component, Inject, InjectionToken, PLATFORM_ID} from '@angular/core';
import {HeaderComponent} from "../app-layout/header/header.component";
import {environment} from "../../environments/environment";
import {NgOptimizedImage} from "@angular/common";
import {ServerRenderDirective} from "../app-layout/directives/server-render.directive";
import {HomeSearchComponent} from "./home-search/home-search.component";
import {ComparativeAdvantageComponent} from "./comparative-advantage/comparative-advantage.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [HeaderComponent, NgOptimizedImage, ServerRenderDirective, HomeSearchComponent, ComparativeAdvantageComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  // TODO: implement only when you need to test detach or something else from CDRef
  // changeDetectorRef = inject(ChangeDetectorRef);

  readonly HERO_IMAGE_MOBILE_WEBP = `${environment.cdnUrl}/assets/images/backgrounds/4zida-pozadina-naslovna-mob-optimized.webp`;
  readonly HERO_IMAGE_MOBILE_JPG = `${environment.cdnUrl}/assets/images/backgrounds/4zida-pozadina-naslovna-mob-optimized.jpg`;
  readonly HERO_IMAGE_DESKTOP = `${environment.cdnUrl}/assets/images/backgrounds/4zida-pozadina-naslovna.jpg`;

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<Object>) {}

  ok() {
    console.count('Home - CD');
  }

  // ngAfterViewInit() {
    // Write here for what doesn't work detach
    // TODO: Mobile:
    // TODO: Search,
    // TODO: Desktop:
    // TODO:
    // this.changeDetectorRef.detach();
  // }
}
