import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ControlValueAccessor, ReactiveFormsModule} from "@angular/forms";
import {PlaceSuggestion} from "../place-suggestion";
import {MatDialog} from "@angular/material/dialog";
import {PlaceMultiSelectDialogComponent} from "./place-multi-select-dialog/place-multi-select-dialog.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {tap} from "rxjs";
import {FilterablePlaceService} from "../filterable-place.service";
import {KeyValuePipe, NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {ForModule} from "@rx-angular/template";

@UntilDestroy()
@Component({
  selector: 'app-place-multi-select-mobile',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonModule,
    KeyValuePipe,
    ForModule
  ],
  templateUrl: './place-multi-select-mobile.component.html',
  styleUrls: ['./place-multi-select-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceMultiSelectMobileComponent implements ControlValueAccessor {
  public dialog = inject(MatDialog);
  public placesService = inject(FilterablePlaceService);

  @Input() withAds = false;
  @Input() submitBtnLabel = 'Pretraži';
  selected: Map<number, PlaceSuggestion> = new Map();
  @Output() valueChange = new EventEmitter<number[]>();
  @Output() optionSelected = new EventEmitter<PlaceSuggestion>();

  openDialog(): void {
    const dialogRef = this.dialog.open(PlaceMultiSelectDialogComponent, {
      maxWidth: 'calc(100% - 1.5rem)',
      width: '100%',
      maxHeight: 'calc(100vh - 1.5rem)',
      position: {bottom: '.75rem'},
      data: {
        selected: this.selected,
        withAds: this.withAds,
        submitBtnLabel: this.submitBtnLabel
      }
    });

    dialogRef.componentInstance.selectedOption
      .pipe(
        untilDestroyed(this),
        tap(suggestion => this.optionSelected.emit(suggestion))
      )
      .subscribe();

    dialogRef.afterClosed()
      .subscribe((action: { action: string, placeIds: number[] }) => {
        if (action) {
          if (!action.placeIds) {
            this.selected.clear();
          }
          this.onChange(action.placeIds);
          this.valueChange.emit(action.placeIds)
        }
        this.onTouched();
      })
  }

  // Function to call when the value changes.
  onChange = (value: number[] | null) => {
  }

  // Function to call when the input is touched
  onTouched = () => {
  }

  // Allows Angular to update the model
  // Update the model and changes needed for the view here.
  writeValue(placeIds: number[]): void {
    if (placeIds && placeIds.length) {
      // this.preloading = true;
      this.placesService.filterByIds(placeIds)
        .subscribe(places => {
          this.selected.clear();
          places?.forEach(place => {
            place.checked = true;
            this.selected.set(place.id, place);
          });
          // this.preloading = false;
        });
    } else {
      this.selected.clear();
    }
  }

  // Allows Angular to register a function to call when the model changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (placeIds: number[] | null) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
  }

}
