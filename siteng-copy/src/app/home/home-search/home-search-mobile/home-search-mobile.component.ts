import {ChangeDetectorRef, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {GtagProps} from "../../../misc/services/gtag.service";
import {For, TYPE_OPTIONS_MAP} from 'src/app/ad/ad';
import {PlaceSuggestion} from "../../../app-forms/place-suggestion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {
  PlaceMultiSelectMobileComponent
} from "../../../app-forms/place-multi-select-mobile/place-multi-select-mobile.component";
import {MatDialogModule} from "@angular/material/dialog";
import {DropdownFieldComponent} from "../../../app-forms/dropdown-field/dropdown-field.component";

@Component({
  selector: 'app-home-search-mobile',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, ReactiveFormsModule, PlaceMultiSelectMobileComponent, NgClass, NgIf, MatDialogModule, DropdownFieldComponent],
  templateUrl: './home-search-mobile.component.html',
  styleUrls: ['./home-search-mobile.component.scss']
})
export class HomeSearchMobileComponent {
  changeDetectionRef = inject(ChangeDetectorRef);

  @Input() formGroup?: FormGroup;
  @Output() gtagProps = new EventEmitter<GtagProps>();
  typeOptionsMap: Map<string, string>;
  For = For;

  constructor() {
    this.typeOptionsMap = TYPE_OPTIONS_MAP;
  }

  setForControl(value: For) {
    const forControl = this.getFormControl('for');

    if (forControl.value !== value) {
      forControl.setValue(value);
    }
  }

  getFormControl(name: string): FormControl {
    return this.formGroup?.get(name) as FormControl;
  }

  onPlaceSelect(place: PlaceSuggestion) {
    this.gtagProps.emit({
      action: 'click',
      category: 'SuggestionFrontPage',
      label: place.title,
      value: place.id
    });
  }

  changeDetection() {
    this.changeDetectionRef.detectChanges();
  }
}
