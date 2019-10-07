import { TestBed } from '@angular/core/testing';

import { AppNotifsStorageService } from './app-notifis-storage.service';

describe('AppNotifsStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppNotifsStorageService = TestBed.get(AppNotifsStorageService);
    expect(service).toBeTruthy();
  });
});
