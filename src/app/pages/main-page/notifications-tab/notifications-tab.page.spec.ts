import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificationsTabPage } from './notifications-tab.page';

describe('NotificationsTabPage', () => {
  let component: NotificationsTabPage;
  let fixture: ComponentFixture<NotificationsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});