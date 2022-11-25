import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-search-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-search-mobile.component.html',
  styleUrls: ['./home-search-mobile.component.scss']
})
export class HomeSearchMobileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
