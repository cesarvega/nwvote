import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamesUploaderComponent } from './names-uploader.component';

describe('NamesUploaderComponent', () => {
  let component: NamesUploaderComponent;
  let fixture: ComponentFixture<NamesUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamesUploaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NamesUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
