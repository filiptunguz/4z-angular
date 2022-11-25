import {Component, inject, Input, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {For, Type, TYPE_OPTIONS_MAP} from "../../ad/ad";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Router} from "@angular/router";
import {GtagAction, GtagService} from "../../misc/services/gtag.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {pairwise, startWith, tap} from "rxjs";
import {SearchFilter} from "../../search/search-filters/search-filter";
import {SearchService} from "../../search/search.service";
import {HomeSearchMobileComponent} from "./home-search-mobile/home-search-mobile.component";

@UntilDestroy()
@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [HomeSearchMobileComponent, NgIf],
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss']
})
export class HomeSearchComponent implements OnInit {
  breakpointObserver = inject(BreakpointObserver);
  router = inject(Router);
  gtag = inject(GtagService);
  searchService = inject(SearchService);

  formGroup: FormGroup = new FormGroup<any>({
    for: new FormControl<For>(For.Sale),
    newBuilding: new FormControl<boolean | null>(null),
    placeIds: new FormControl<number[]>([]),
    type: new FormControl<Type>(Type.Apartment)
  });

  isDesktopFormView = false;

  @Input() set searchByPlace(placeId: number | undefined) {
    if (placeId) {
      this.formGroup.get('placeIds')?.setValue([placeId]);
      this.submitForm();
    }
  }

  constructor() {
    this.breakpointObserver
      .observe(['(min-width: 900px)'])
      .pipe(
        untilDestroyed(this),
        tap(data => this.isDesktopFormView = data.matches)
      ).subscribe();
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        untilDestroyed(this),
        startWith(this.formGroup.value),
        pairwise(),
        tap(([prev, next]) => this.formGtagEvents(prev, next))
      )
      .subscribe();

    const ctrlFor = this.formGroup.get('for');
    const ctrlNewBuilding = this.formGroup.get('newBuilding');

    if (ctrlFor) {
      ctrlFor.valueChanges
        .pipe(untilDestroyed(this))
        .subscribe(
          value => value === For.Rent
            ? ctrlNewBuilding?.disable()
            : ctrlNewBuilding?.enable()
        )
    }

    this.onFormChange(ctrlNewBuilding);
  }

  onFormChange(ctrlNewBuilding: AbstractControl | null) {
    const type = this.formGroup.get('type');
    if(type?.valueChanges) {
      type.valueChanges
        .pipe(untilDestroyed(this))
        .subscribe(value => {
          if (value === Type.Lot || value === Type.VehicleSpot) {
            ctrlNewBuilding?.disable();
          } else {
            this.formGroup.get('for')?.value === For.Rent ? ctrlNewBuilding?.disable() : ctrlNewBuilding?.enable();
          }
        })
    }
  }

  submitForm() {
    this.searchService
      .filterToRouteAndParams(SearchFilter.fromFormValue(this.formGroup.value))
      .pipe(untilDestroyed(this))
      .subscribe(({route, queryParams}) => {
        if (this.formGroup.get('newBuilding')?.value) {
          document.location.href = this.searchService.filterToHomstersUrl(queryParams);
        } else {
          this.router.navigate([route], {queryParams}).then();
        }
      });
    this.sendEvent('click', 'Pretraži');
  }

  sendEvent(action: GtagAction, label: string, value?: any) {
    this.gtag.event(action, 'SearchFrontPage', label, value);
  }

  formGtagEvents(prev: HomeSearchFormValue, next: HomeSearchFormValue) {
    if (prev.for !== next.for) {
      this.sendEvent('click', next.for === For.Sale ? 'Prodaja' : 'Izdavanje')
    }

    if (prev.type !== next.type) {
      this.sendEvent('pick', TYPE_OPTIONS_MAP.get(next.type)!)
    }

    if (next.newBuilding && prev.newBuilding !== next.newBuilding) {
      this.sendEvent('check', 'Novogradnja')
    }

    if (prev.newBuilding && prev.newBuilding !== next.newBuilding) {
      this.sendEvent('uncheck', 'Novogradnja')
    }
  }
}

interface HomeSearchFormValue {
  for: For;
  newBuilding?: boolean;
  placeIds: number[]|[];
  type: Type;
}
