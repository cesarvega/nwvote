import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInformationComponent } from './project-information.component';

describe('ProjectInformationComponent', () => {
  let component: ProjectInformationComponent;
  let fixture: ComponentFixture<ProjectInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectInformationComponent]
    });
    fixture = TestBed.createComponent(ProjectInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
