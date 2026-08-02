import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherItem } from './teacher-item';

describe('TeacherItem', () => {
  let component: TeacherItem;
  let fixture: ComponentFixture<TeacherItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
