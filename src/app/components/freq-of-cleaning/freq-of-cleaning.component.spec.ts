import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreqOfCleaningComponent } from './freq-of-cleaning.component';

describe('FreqOfCleaningComponent', () => {
  let component: FreqOfCleaningComponent;
  let fixture: ComponentFixture<FreqOfCleaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreqOfCleaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreqOfCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
