import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaNeedCleaningComponent } from './area-need-cleaning.component';

describe('AreaNeedCleaningComponent', () => {
  let component: AreaNeedCleaningComponent;
  let fixture: ComponentFixture<AreaNeedCleaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaNeedCleaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaNeedCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
