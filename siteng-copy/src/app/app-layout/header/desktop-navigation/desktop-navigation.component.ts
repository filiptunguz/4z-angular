import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desktop-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desktop-navigation.component.html',
  styleUrls: ['./desktop-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
