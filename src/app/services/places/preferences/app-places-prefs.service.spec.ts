import { TestBed } from '@angular/core/testing';

import { AppPlacesPrefsService } from './app-places-prefs.service';

describe('AppPlacesPrefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppPlacesPrefsService = TestBed.get(AppPlacesPrefsService);
    expect(service).toBeTruthy();
  });
});
