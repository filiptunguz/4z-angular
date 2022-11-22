import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
