import {ChangeDetectorRef, Directive, inject, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {PlatformService} from "../services/platform.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Directive({
  selector: '[appDesktopRender]',
  standalone: true,
})
export class DesktopRenderDirective implements OnInit {
  platformService = inject(PlatformService);
  templateRef = inject(TemplateRef<any>);
  viewContainer = inject(ViewContainerRef);
  changeDetectorRef = inject(ChangeDetectorRef);

  private visible = false;

  ngOnInit() {
    this.platformService.desktop$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(isDesktop => this.toggle(isDesktop));
  }

  private toggle(condition: boolean): void {
    if (condition && !this.visible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true;
      // I'll put here detectChanges - triggers CD cycle, markForChecks mark as dirty component and all her ancestors
      // Now we will not trigger CD in home component, and we can do detach on parent component
      this.changeDetectorRef.detectChanges();
    } else if (!condition && this.visible) {
      this.viewContainer.clear();
      this.visible = false;
    }
  }
}
