import { TestBed } from '@angular/core/testing';

import { AppBusinessesStorageService } from './app-businesses-storage.service';

describe('AppBusinessesStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppBusinessesStorageService = TestBed.get(AppBusinessesStorageService);
    expect(service).toBeTruthy();
  });
});
