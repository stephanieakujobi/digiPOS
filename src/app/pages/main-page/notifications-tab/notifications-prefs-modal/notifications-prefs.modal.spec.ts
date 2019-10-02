/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPrefsModal } from './notifications-prefs.modal';

describe('NotificationsPrefsModal', () => {
  let component: NotificationsPrefsModal;
  let fixture: ComponentFixture<NotificationsPrefsModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsPrefsModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsPrefsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});