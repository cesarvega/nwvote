import { TestBed } from '@angular/core/testing';

import { NwvoteService } from './nwvote.service';

describe('NwvoteService', () => {
  let service: NwvoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NwvoteService);
  });
6666
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
