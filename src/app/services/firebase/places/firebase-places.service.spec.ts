import { TestBed } from '@angular/core/testing';

import { FirebasePlacesService } from './firebase-places.service';

describe('FirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebasePlacesService = TestBed.get(FirebasePlacesService);
    expect(service).toBeTruthy();
  });
});
