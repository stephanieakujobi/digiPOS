import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifsPrefsModalPage } from './notifications-prefs-modal.page';

describe('NotifsPrefsModalPage', () => {
  let component: NotifsPrefsModalPage;
  let fixture: ComponentFixture<NotifsPrefsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotifsPrefsModalPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifsPrefsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});