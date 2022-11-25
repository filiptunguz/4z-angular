import {
  Directive,
  inject,
  Inject,
  InjectionToken,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {isPlatformServer} from "@angular/common";

@Directive({
  selector: '[appServerRender]',
  standalone: true
})
export class ServerRenderDirective implements OnInit {
  viewContainer = inject(ViewContainerRef);
  templateRef = inject(TemplateRef<any>);

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<Object>) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
