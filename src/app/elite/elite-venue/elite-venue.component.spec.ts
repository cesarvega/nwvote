import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteVenueComponent } from './elite-venue.component';

describe('EliteVenueComponent', () => {
  let component: EliteVenueComponent;
  let fixture: ComponentFixture<EliteVenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteVenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
