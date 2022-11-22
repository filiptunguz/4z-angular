import {ChangeDetectorRef, Directive, inject, TemplateRef, ViewContainerRef} from '@angular/core';
import {PlatformService} from "../services/platform.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Directive({
  selector: '[appDesktopLgRender]',
  standalone: true,
})
export class DesktopLgRenderDirective {
  platformService = inject(PlatformService);
  templateRef = inject(TemplateRef<any>);
  viewContainer = inject(ViewContainerRef);
  changeDetectorRef = inject(ChangeDetectorRef);

  private visible = false;

  constructor() {
    this.platformService.desktopLg$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(isDesktopLg => this.toggle(isDesktopLg));
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
