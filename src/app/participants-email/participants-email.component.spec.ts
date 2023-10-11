import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsEmailComponent } from './participants-email.component';

describe('ParticipantsEmailComponent', () => {
  let component: ParticipantsEmailComponent;
  let fixture: ComponentFixture<ParticipantsEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantsEmailComponent]
    });
    fixture = TestBed.createComponent(ParticipantsEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
