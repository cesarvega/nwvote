import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFirstPageComponent } from './report-first-page.component';

describe('ReportFirstPageComponent', () => {
  let component: ReportFirstPageComponent;
  let fixture: ComponentFixture<ReportFirstPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFirstPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFirstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
