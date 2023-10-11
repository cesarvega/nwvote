import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReportsComponent } from './project-reports.component';

describe('ProjectReportsComponent', () => {
  let component: ProjectReportsComponent;
  let fixture: ComponentFixture<ProjectReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectReportsComponent]
    });
    fixture = TestBed.createComponent(ProjectReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
