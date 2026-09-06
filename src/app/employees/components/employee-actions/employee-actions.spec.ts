import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeActions } from './employee-actions';

describe('EmployeeActions', () => {
  let component: EmployeeActions;
  let fixture: ComponentFixture<EmployeeActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeActions],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
