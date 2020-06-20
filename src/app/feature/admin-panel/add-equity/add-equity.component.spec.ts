import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquityComponent } from './add-equity.component';

describe('AddEquityComponent', () => {
  let component: AddEquityComponent;
  let fixture: ComponentFixture<AddEquityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEquityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEquityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
