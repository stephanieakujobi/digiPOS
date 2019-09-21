/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSettingsModal } from './notifications-settings.modal';

describe('NotificationsSettingsPage', () => {
  let component: NotificationsSettingsModal;
  let fixture: ComponentFixture<NotificationsSettingsModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsSettingsModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSettingsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});