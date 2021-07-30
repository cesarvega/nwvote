import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCreationDesignComponent } from './survey-creation-design.component';

describe('SurveyCreationDesignComponent', () => {
  let component: SurveyCreationDesignComponent;
  let fixture: ComponentFixture<SurveyCreationDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyCreationDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyCreationDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
