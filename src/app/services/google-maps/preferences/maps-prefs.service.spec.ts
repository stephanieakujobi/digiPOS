import { TestBed } from '@angular/core/testing';

import { MapsPrefsService } from './maps-prefs.service';

describe('MapsPrefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapsPrefsService = TestBed.get(MapsPrefsService);
    expect(service).toBeTruthy();
  });
});
