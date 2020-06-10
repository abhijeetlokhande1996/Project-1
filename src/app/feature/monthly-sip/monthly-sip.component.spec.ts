import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySipComponent } from './monthly-sip.component';

describe('MonthlySipComponent', () => {
  let component: MonthlySipComponent;
  let fixture: ComponentFixture<MonthlySipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlySipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
