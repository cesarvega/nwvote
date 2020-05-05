import { TestBed } from '@angular/core/testing';

import { BsrMobileService } from './bsr-mobile.service';

describe('BsrMobileService', () => {
  let service: BsrMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BsrMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
