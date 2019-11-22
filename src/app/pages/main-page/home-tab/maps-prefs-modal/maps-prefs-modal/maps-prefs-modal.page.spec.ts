import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsPrefsModalPage } from './maps-prefs-modal.page';

describe('MapsPrefsModalPage', () => {
  let component: MapsPrefsModalPage;
  let fixture: ComponentFixture<MapsPrefsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsPrefsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsPrefsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
