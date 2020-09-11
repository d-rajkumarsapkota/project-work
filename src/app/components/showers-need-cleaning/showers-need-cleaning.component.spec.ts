import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowersNeedCleaningComponent } from './showers-need-cleaning.component';

describe('ShowersNeedCleaningComponent', () => {
  let component: ShowersNeedCleaningComponent;
  let fixture: ComponentFixture<ShowersNeedCleaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowersNeedCleaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowersNeedCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
