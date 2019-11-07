import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceViewModalPage } from './place-view-modal.page';

describe('PlaceViewModalPage', () => {
  let component: PlaceViewModalPage;
  let fixture: ComponentFixture<PlaceViewModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceViewModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceViewModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
