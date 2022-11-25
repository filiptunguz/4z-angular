import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSearchMobileComponent } from './home-search-mobile.component';

describe('HomeSearchMobileComponent', () => {
  let component: HomeSearchMobileComponent;
  let fixture: ComponentFixture<HomeSearchMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HomeSearchMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSearchMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
