import {Directive, Inject, InjectionToken, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef} from '@angular/core';
import {isPlatformServer} from "@angular/common";

@Directive({
  selector: '[appServerRender]',
  standalone: true
})
export class ServerRenderDirective implements OnInit {

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>
  ) {

  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
