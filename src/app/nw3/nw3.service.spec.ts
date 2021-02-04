import { TestBed } from '@angular/core/testing';

import { Nw3Service } from './nw3.service';

describe('Nw3Service', () => {
  let service: Nw3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nw3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
