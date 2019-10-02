import { TestBed } from '@angular/core/testing';

import { AppNotifsPrefsService } from './app-notifs-prefs.service';

describe('AppNotifsPrefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppNotifsPrefsService = TestBed.get(AppNotifsPrefsService);
    expect(service).toBeTruthy();
  });
});
