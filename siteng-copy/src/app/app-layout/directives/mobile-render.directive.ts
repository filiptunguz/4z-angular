import {ChangeDetectorRef, Directive, inject, TemplateRef, ViewContainerRef} from '@angular/core';
import {PlatformService} from "../services/platform.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Directive({
  selector: '[appMobileLgRender]',
  standalone: true,
})
export class MobileLgRenderDirective {
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
      this.changeDetectorRef.markForCheck();
    } else if (!condition && this.visible) {
      this.viewContainer.clear();
      this.visible = false;
    }
  }
}
