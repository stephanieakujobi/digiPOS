import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationsPrefsModalModule } from './pages/main-page/notifications-tab/notifications-prefs-modal/notifications-prefs.modal.module';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BusinessViewModalPageModule } from './pages/main-page/businesses-tab/business-view-modal/business-view-modal.module';
import { BusinessPrefsModalPageModule } from './pages/main-page/businesses-tab/business-prefs/business-prefs-modal.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BusinessViewModalPageModule,
    BusinessPrefsModalPageModule,
    NotificationsPrefsModalModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }