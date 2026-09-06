import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCell } from './phone-cell';

describe('PhoneCell', () => {
  let component: PhoneCell;
  let fixture: ComponentFixture<PhoneCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneCell],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneCell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
