import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToiletsNeedCleaningComponent } from './toilets-need-cleaning.component';

describe('ToiletsNeedCleaningComponent', () => {
  let component: ToiletsNeedCleaningComponent;
  let fixture: ComponentFixture<ToiletsNeedCleaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToiletsNeedCleaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToiletsNeedCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
