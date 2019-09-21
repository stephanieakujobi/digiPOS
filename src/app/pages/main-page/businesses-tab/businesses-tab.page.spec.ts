/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/16
*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusinessesTabPage } from './businesses-tab.page';

describe('BusinessesTabPage', () => {
  let component: BusinessesTabPage;
  let fixture: ComponentFixture<BusinessesTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessesTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessesTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
