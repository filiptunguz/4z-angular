import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceMultiSelectDialogComponent } from './place-multi-select-dialog.component';

describe('PlaceMultiSelectDialogComponent', () => {
  let component: PlaceMultiSelectDialogComponent;
  let fixture: ComponentFixture<PlaceMultiSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlaceMultiSelectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceMultiSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
