import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDialogBsrComponent } from './survey-dialog-bsr.component';

describe('SurveyDialogComponent', () => {
  let component: SurveyDialogBsrComponent;
  let fixture: ComponentFixture<SurveyDialogBsrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyDialogBsrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyDialogBsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
