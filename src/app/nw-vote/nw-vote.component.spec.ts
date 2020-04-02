import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NwVoteComponent } from './nw-vote.component';

describe('NwVoteComponent', () => {
  let component: NwVoteComponent;
  let fixture: ComponentFixture<NwVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NwVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NwVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
