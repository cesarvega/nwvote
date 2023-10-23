import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsEmailComponent } from './participants-email.component';

describe('ParticipantsEmailComponent', () => {
  let component: ParticipantsEmailComponent;
  let fixture: ComponentFixture<ParticipantsEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
