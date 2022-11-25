import {AfterViewInit, Component, ElementRef, EventEmitter, inject, Inject, ViewChild,} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {debounceTime, filter, fromEvent, map, of, switchMap, tap} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FilterablePlaceService} from "../../filterable-place.service";
import {PlaceSuggestion} from "../../place-suggestion";
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {KeyValuePipe, NgIf} from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ForModule} from "@rx-angular/template";

export interface DialogData {
  selected: Map<number, PlaceSuggestion>;
  withAds: boolean;
  submitBtnLabel: string;
}

@UntilDestroy()
@Component({
  selector: 'app-place-multi-select-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    NgIf,
    ForModule,
    KeyValuePipe,
    MatDividerModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './place-multi-select-dialog.component.html',
  styleUrls: ['./place-multi-select-dialog.component.scss']
})
export class PlaceMultiSelectDialogComponent implements AfterViewInit {
  public dialogRef = inject(MatDialogRef<PlaceMultiSelectDialogComponent>);
  private placesService = inject(FilterablePlaceService);

  @ViewChild('place', {static: false}) place?: ElementRef;
  loading = false;
  suggestions: PlaceSuggestion[] = [];
  selectedOption = new EventEmitter<PlaceSuggestion>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngAfterViewInit(): void {
    fromEvent<{ target: HTMLInputElement }>(this.place?.nativeElement, 'keyup')
      .pipe(
        untilDestroyed(this),
        map((event: { target: HTMLInputElement }) => event.target.value),
        filter(term => term.length >= 3 || term.toLocaleLowerCase() === 'ub'),
        debounceTime(300),
        tap(() => {
          this.loading = true;
        }),
        switchMap(term => term ? this.placesService.filterByTerm(term, this.data.withAds, this.value) : of([]))
      ).subscribe(suggestions => {
      this.suggestions = suggestions;
      this.loading = false;
    });
  }

  get value(): number[] {
    if (this.data.selected.size > 0) {
      return Array.from(this.data.selected.keys());
    }

    return [];
  }

  select(suggestion: PlaceSuggestion) {
    this.data.selected.set(suggestion.id, suggestion);
    this.selectedOption.emit(suggestion);
  }

  unSelect(suggestionId: number) {
    this.data.selected.delete(suggestionId);
  }

  onConfirm() {
    this.dialogRef.close({action: 'confirm', placeIds: this.value})
    // this.data.selected.clear();
  }

  onCancel() {
    this.dialogRef.close({action: 'cancel', placeIds: null})
    // this.data.selected.clear();
  }
}
