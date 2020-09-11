import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenQuoteComponent } from './gen-quote.component';

describe('GenQuoteComponent', () => {
  let component: GenQuoteComponent;
  let fixture: ComponentFixture<GenQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
