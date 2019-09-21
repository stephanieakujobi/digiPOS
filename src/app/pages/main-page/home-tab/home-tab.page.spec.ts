/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTabPage } from './home-tab.page';

describe('HomeTabPage', () => {
  let component: HomeTabPage;
  let fixture: ComponentFixture<HomeTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
