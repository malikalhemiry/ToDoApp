import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface SelectOption {
  value: string;
  label: string;
}

const TEMPLATE_KEY = 'account-report-template-v2';

@Component({
  selector: 'app-account-report-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './account-report-form.component.html',
  styleUrl: './account-report-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountReportFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly currencies: SelectOption[] = [
    { value: 'YER', label: 'ريال يمني' },
    { value: 'SAR', label: 'ريال سعودي' },
    { value: 'USD', label: 'دولار أمريكي' },
  ];

  readonly documents: SelectOption[] = [
    { value: 'all',     label: 'كافة المستندات' },
    { value: 'receipt', label: 'سندات القبض' },
    { value: 'payment', label: 'سندات الصرف' },
    { value: 'journal', label: 'قيود اليومية' },
  ];

  readonly periods: SelectOption[] = [
    { value: 'until', label: 'حتى يوم' },
    { value: 'from',  label: 'من تاريخ' },
    { value: 'month', label: 'خلال شهر' },
  ];

  readonly matched = signal(false);
  readonly message = signal<string | null>(null);

  readonly form = this.fb.group({
    detailedBalance:   [true],
    currency:          ['YER'],
    documents:         ['all'],
    accountNo:         ['231002', [Validators.required, Validators.pattern(/^\d+$/)]],

    localEquivalent:   [true],
    accountName:       ['الصندوق الرئيسي', Validators.required],
    subAccountNo:      ['1211001', [Validators.required, Validators.pattern(/^\d+$/)]],
    uniqueNo:          ['0'],

    noPreviousBalance: [false],
    period:            ['until'],
    date:              ['2026-09-29', Validators.required],

    groupByDay:        [true],
    viewType:          ['totals' as 'totals' | 'balances'],
    groupByDocument:   [true],
    status:            ['current' as 'current' | 'historical'],
    englishReport:     [false],
  });

  constructor() {
    this.loadTemplate();

    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.matched.set(false));
  }

  onMatch(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.flash('يرجى تصحيح الحقول المطلوبة');
      return;
    }
    console.log('match', this.form.getRawValue());
    this.matched.set(true);
    this.flash('تمت المطابقة بنجاح');
  }

  showJournal(): void {
    console.log('show journal', this.form.getRawValue());
  }

  sendReport(): void {
    console.log('send report to client', this.form.getRawValue());
    this.flash('تم إرسال التقرير إلى العميل بنجاح');
  }

  saveTemplate(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(this.form.getRawValue()));
    this.flash('تم حفظ القالب بنجاح');
  }

  private loadTemplate(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(TEMPLATE_KEY);
      if (raw) this.form.patchValue(JSON.parse(raw));
    } catch {
      localStorage.removeItem(TEMPLATE_KEY);
    }
  }

  private flash(text: string): void {
    this.message.set(text);
    setTimeout(() => this.message.set(null), 3000);
  }
}