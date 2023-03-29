import { TestBed } from '@angular/core/testing';

import { BsrService } from './bsr.service';

describe('BsrService', () => {
  let service: BsrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BsrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
