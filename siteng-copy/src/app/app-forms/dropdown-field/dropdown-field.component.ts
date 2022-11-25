import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Option} from "../option";
import {MatOption} from "@angular/material/core";
import {ForModule} from "@rx-angular/template";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dropdown-field',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, ForModule, NgIf],
  templateUrl: './dropdown-field.component.html',
  styleUrls: ['./dropdown-field.component.scss']
})
export class DropdownFieldComponent {
  @Input() control: FormControl = new FormControl<any>('default');
  @Input() label = 'Label';
  @Input() multiple: boolean = false;
  @Input() name = '';
  @Input() set simpleChoice(is: true) {
    if (is) {
      this.options = [
        new Option(undefined, 'Izaberi'),
        new Option(true, 'Da'),
        new Option(false, 'Ne'),
      ];
    }
  }

  @Input() set optionMap(map: Map<string | number | boolean | null | undefined, string>) {
    this.options = Array.from(map).map(entry => new Option(entry[0], entry[1]));
  }

  /**
   * @see optionMap
   */
  @Input() options: Option[] = [];
  @Input() placeholder = 'Placeholder';

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() clickedOn = new EventEmitter<MatOption>();

  valueSelected(change: MatSelectChange): void {
    this.valueChange.emit(change.value);
  }
}
