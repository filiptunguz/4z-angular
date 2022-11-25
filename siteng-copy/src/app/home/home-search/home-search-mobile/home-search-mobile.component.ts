import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup} from "@angular/forms";
import {GtagProps} from "../../../misc/services/gtag.service";
import {For, TYPE_OPTIONS_MAP} from 'src/app/ad/ad';
import {PlaceSuggestion} from "../../../app-forms/place-suggestion";

@Component({
  selector: 'app-home-search-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-search-mobile.component.html',
  styleUrls: ['./home-search-mobile.component.scss']
})
export class HomeSearchMobileComponent {
  @Input() formGroup!: FormGroup;
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
    return this.formGroup.get(name) as FormControl;
  }

  onPlaceSelect(place: PlaceSuggestion) {
    this.gtagProps.emit({
      action: 'click',
      category: 'SuggestionFrontPage',
      label: place.title,
      value: place.id
    });
  }
}
