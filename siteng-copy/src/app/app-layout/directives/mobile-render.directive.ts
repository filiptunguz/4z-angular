import {ChangeDetectorRef, Directive, inject, TemplateRef, ViewContainerRef} from '@angular/core';
import {PlatformService} from "../services/platform.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Directive({
  selector: '[appMobileRender]',
  standalone: true,
})
export class MobileRenderDirective {
  platformService = inject(PlatformService);
  templateRef = inject(TemplateRef<any>);
  viewContainer = inject(ViewContainerRef);
  changeDetectorRef = inject(ChangeDetectorRef);

  private visible = false;

  constructor() {
    this.platformService.desktop$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(isDesktop => this.toggle(!isDesktop));
  }

  private toggle(condition: boolean): void {
    if (condition && !this.visible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true;
    } else if (!condition && this.visible) {
      this.viewContainer.clear();
      this.visible = false;
    }
  }
}
