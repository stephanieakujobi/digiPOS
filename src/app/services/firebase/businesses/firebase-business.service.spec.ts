import { TestBed } from '@angular/core/testing';

import { FirebaseBusinessService } from './firebase-business.service';

describe('FirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseBusinessService = TestBed.get(FirebaseBusinessService);
    expect(service).toBeTruthy();
  });
});
