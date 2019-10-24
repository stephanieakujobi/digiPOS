import { TestBed } from '@angular/core/testing';

import { AppBusinessesPrefsService } from './app-businesses-prefs.service';

describe('AppBusinessesPrefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppBusinessesPrefsService = TestBed.get(AppBusinessesPrefsService);
    expect(service).toBeTruthy();
  });
});
