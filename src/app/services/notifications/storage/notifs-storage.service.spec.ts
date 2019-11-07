import { TestBed } from '@angular/core/testing';

import { NotifsStorageService } from './notifis-storage.service';

describe('AppNotifsStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotifsStorageService = TestBed.get(NotifsStorageService);
    expect(service).toBeTruthy();
  });
});
