import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesPrefsModalPage } from './places-prefs-modal.page';

describe('PlacesPrefsModalPage', () => {
  let component: PlacesPrefsModalPage;
  let fixture: ComponentFixture<PlacesPrefsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesPrefsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesPrefsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
