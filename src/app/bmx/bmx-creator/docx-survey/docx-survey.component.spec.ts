import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocxSurveyComponent } from './docx-survey.component';

describe('DocxSurveyComponent', () => {
  let component: DocxSurveyComponent;
  let fixture: ComponentFixture<DocxSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocxSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocxSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
