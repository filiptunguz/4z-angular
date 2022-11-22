import {Inject, inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {DOCUMENT} from "@angular/common";
import {map} from "rxjs";

export const Breakpoint = {
  Desktop: '(min-width: 599.98px) and (orientation: portrait), (min-width: 959.98px) and (orientation: landscape)',
  DesktopLg: '(min-width: 990px)'
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  breakpointObserver = inject(BreakpointObserver);
  rendererFactory = inject(RendererFactory2);

  renderer: Renderer2;

  // (min-width: 599.98px) and (orientation: portrait),
  // (min-width: 959.98px) and (orientation: landscape)
  desktop$ = this.breakpointObserver
    .observe(Breakpoint.Desktop)
    .pipe(
      map(({matches}) => matches)
    );

  // (min-width: 990px)
  desktopLg$ = this.breakpointObserver
    .observe(Breakpoint.DesktopLg)
    .pipe(
      map(({matches}) => matches)
    );

  constructor(@Inject(DOCUMENT) private _document: Document) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  setBodyNoScroll(noScroll: boolean) {
    const body = this._document.body;
    noScroll ? body.classList.add('body-scroll-fix') : body.classList.remove('body-scroll-fix');
  }
}
