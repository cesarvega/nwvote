import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyMatrixComponent } from './survey-matrix.component';

describe('SurveyMatrixComponent', () => {
  let component: SurveyMatrixComponent;
  let fixture: ComponentFixture<SurveyMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
