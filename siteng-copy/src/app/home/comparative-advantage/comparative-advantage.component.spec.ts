import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparativeAdvantageComponent } from './comparative-advantage.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ComparativeAdvantagesComponent', () => {
  let component: ComparativeAdvantageComponent;
  let fixture: ComponentFixture<ComparativeAdvantageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComparativeAdvantageComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativeAdvantageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
