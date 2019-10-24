import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessViewModalPage } from './business-view-modal.page';

describe('BusinessViewModalPage', () => {
  let component: BusinessViewModalPage;
  let fixture: ComponentFixture<BusinessViewModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessViewModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessViewModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
