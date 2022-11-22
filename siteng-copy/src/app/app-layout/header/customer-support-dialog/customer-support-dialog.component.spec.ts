import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSupportDialogComponent } from './customer-support-dialog.component';

describe('CustomerSupportDialogComponent', () => {
  let component: CustomerSupportDialogComponent;
  let fixture: ComponentFixture<CustomerSupportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CustomerSupportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSupportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
