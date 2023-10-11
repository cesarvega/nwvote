import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmxSurveyComponent } from './bmx-survey.component';

describe('BmxSurveyComponent', () => {
  let component: BmxSurveyComponent;
  let fixture: ComponentFixture<BmxSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BmxSurveyComponent]
    });
    fixture = TestBed.createComponent(BmxSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
