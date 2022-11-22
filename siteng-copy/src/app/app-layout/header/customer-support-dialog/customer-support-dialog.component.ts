import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-support-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-support-dialog.component.html',
  styleUrls: ['./customer-support-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSupportDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
