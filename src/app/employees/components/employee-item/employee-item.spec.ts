import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeItem } from './employee-item';

describe('EmployeeItem', () => {
  let component: EmployeeItem;
  let fixture: ComponentFixture<EmployeeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeItem],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
