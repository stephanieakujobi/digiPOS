/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTabBarPage } from './main-tab-bar.page';

describe('MainTabBarPage', () => {
  let component: MainTabBarPage;
  let fixture: ComponentFixture<MainTabBarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainTabBarPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTabBarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
