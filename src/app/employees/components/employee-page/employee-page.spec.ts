import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePage } from './employee-page';

describe('EmployeePage', () => {
  let component: EmployeePage;
  let fixture: ComponentFixture<EmployeePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePage],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
