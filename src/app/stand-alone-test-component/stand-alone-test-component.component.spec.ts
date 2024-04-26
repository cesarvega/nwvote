import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandAloneTestComponentComponent } from './stand-alone-test-component.component';

describe('StandAloneTestComponentComponent', () => {
  let component: StandAloneTestComponentComponent;
  let fixture: ComponentFixture<StandAloneTestComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandAloneTestComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandAloneTestComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
