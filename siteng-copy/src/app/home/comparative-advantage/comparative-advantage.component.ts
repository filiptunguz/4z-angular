import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {advantages, ComparativeAdvantage} from './advantages';
import {GtagService} from '../../misc/services/gtag.service';
import {environment} from '../../../environments/environment';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {NgIf} from '@angular/common';
import {RouterLinkWithHref} from '@angular/router';
import {CarouselComponent, CarouselOptions} from '../../app-layout/carousel/carousel.component';
import {ForModule} from "@rx-angular/template";

@Component({
  selector: 'app-comparative-advantage',
  templateUrl: './comparative-advantage.component.html',
  styleUrls: ['./comparative-advantage.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLinkWithHref, MatIconModule, CarouselComponent, ForModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparativeAdvantageComponent {
  options: CarouselOptions;
  advantages: ComparativeAdvantage[];
  load = false;

  constructor(
    public gtag: GtagService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.options = {
      visibleItems: 1,
      spaceBetween: 0.5,
      auto: {
        // auto: true,
        delay: 4000,
      },
      breakpoints: {
        0: {
          visibleItems: 1,
        },
        600: {
          visibleItems: 2,
        },
        920: {
          visibleItems: 3,
        },
      },
    };
    this.advantages = advantages;
    this.matIconRegistry.addSvgIcon(
      'pitaj-pravnika',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        environment.cdnUrl + '/assets/icons/pitaj-pravnika.svg'
      )
    );
  }
}
