import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlacesTabPage } from './places-tab.page';

describe('PlacesTabPage', () => {
  let component: PlacesTabPage;
  let fixture: ComponentFixture<PlacesTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlacesTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlacesTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
