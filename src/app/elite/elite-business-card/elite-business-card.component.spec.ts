import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteBusinessCardComponent } from './elite-business-card.component';

describe('EliteBusinessCardComponent', () => {
  let component: EliteBusinessCardComponent;
  let fixture: ComponentFixture<EliteBusinessCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteBusinessCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteBusinessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
