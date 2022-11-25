 import {Directive, Inject, InjectionToken, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Directive({
  selector: '[appBrowserRender]',
  standalone: true
})
export class BrowserRenderDirective implements OnInit {

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>
  ) {

  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
