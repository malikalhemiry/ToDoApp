import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountReportFormComponent } from './account-report-form.component';

describe('AccountReportFormComponent', () => {
  let component: AccountReportFormComponent;
  let fixture: ComponentFixture<AccountReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountReportFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountReportFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
