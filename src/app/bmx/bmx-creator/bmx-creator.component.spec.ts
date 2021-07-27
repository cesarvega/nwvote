import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmxCreatorComponent } from './bmx-creator.component';

describe('BmxCreatorComponent', () => {
  let component: BmxCreatorComponent;
  let fixture: ComponentFixture<BmxCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmxCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmxCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
