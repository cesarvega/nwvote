import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteBusinessComponent } from './elite-business.component';

describe('EliteBusinessComponent', () => {
  let component: EliteBusinessComponent;
  let fixture: ComponentFixture<EliteBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
