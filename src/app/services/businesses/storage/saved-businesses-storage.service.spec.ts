import { TestBed } from '@angular/core/testing';

import { SavedBusinessesStorageService } from './saved-businesses-storage.service';

describe('SavedBusinessesStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SavedBusinessesStorageService = TestBed.get(SavedBusinessesStorageService);
    expect(service).toBeTruthy();
  });
});
