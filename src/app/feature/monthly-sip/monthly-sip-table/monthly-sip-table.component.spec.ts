import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySipTableComponent } from './monthly-sip-table.component';

describe('MonthlySipTableComponent', () => {
  let component: MonthlySipTableComponent;
  let fixture: ComponentFixture<MonthlySipTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlySipTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySipTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
