import { TestBed } from '@angular/core/testing';

import { NotifsPrefsService } from './notifs-prefs.service';

describe('NotifsPrefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotifsPrefsService = TestBed.get(NotifsPrefsService);
    expect(service).toBeTruthy();
  });
});
