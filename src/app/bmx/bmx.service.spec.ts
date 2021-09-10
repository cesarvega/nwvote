import { TestBed } from '@angular/core/testing';

import { BmxService } from './bmx.service';

describe('BmxService', () => {
  let service: BmxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BmxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
