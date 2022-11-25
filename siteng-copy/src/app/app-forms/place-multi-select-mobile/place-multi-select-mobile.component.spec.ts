import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceMultiSelectMobileComponent } from './place-multi-select-mobile.component';

describe('PlaceMultiSelectMobileComponent', () => {
  let component: PlaceMultiSelectMobileComponent;
  let fixture: ComponentFixture<PlaceMultiSelectMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlaceMultiSelectMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceMultiSelectMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
