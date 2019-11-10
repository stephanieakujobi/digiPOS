import { TestBed } from '@angular/core/testing';

import { NotifsGeneratorService } from './notifs-generator.service';

describe('NotifsGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotifsGeneratorService = TestBed.get(NotifsGeneratorService);
    expect(service).toBeTruthy();
  });
});
