import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {HeaderComponent} from "../app-layout/header/header.component";
import {environment} from "../../environments/environment";
import {NgOptimizedImage} from "@angular/common";
import {ServerRenderDirective} from "../app-layout/directives/server-render.directive";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, NgOptimizedImage, ServerRenderDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly HERO_IMAGE_MOBILE_WEBP = `${environment.cdnUrl}/assets/images/backgrounds/4zida-pozadina-naslovna-mob-optimized.webp`;
  readonly HERO_IMAGE_MOBILE_JPG = `${environment.cdnUrl}/assets/images/backgrounds/4zida-pozadina-naslovna-mob-optimized.jpg`;
  readonly HERO_IMAGE_DESKTOP = `${environment.cdnUrl}/assets/images/backgrounds/4zida-pozadina-naslovna.jpg`;

  @ViewChild('background') background?: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<Object>) {}

  ok() {
    console.count('Home - CD');
  }
}
