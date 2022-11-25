import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-multi-select-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-multi-select-dialog.component.html',
  styleUrls: ['./place-multi-select-dialog.component.scss']
})
export class PlaceMultiSelectDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
