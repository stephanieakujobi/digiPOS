import { TestBed } from '@angular/core/testing';

import { LaunchNavService } from './launch-nav.service';

describe('LaunchNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaunchNavService = TestBed.get(LaunchNavService);
    expect(service).toBeTruthy();
  });
});
