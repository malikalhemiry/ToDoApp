import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbsTreeComponent } from './ebs-tree-component';

describe('EbsTreeComponent', () => {
  let component: EbsTreeComponent;
  let fixture: ComponentFixture<EbsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbsTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EbsTreeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
