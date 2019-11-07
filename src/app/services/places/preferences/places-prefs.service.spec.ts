import { TestBed } from '@angular/core/testing';

import { PlacesPrefsService } from './places-prefs.service';

describe('PlacesPrefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlacesPrefsService = TestBed.get(PlacesPrefsService);
    expect(service).toBeTruthy();
  });
});
