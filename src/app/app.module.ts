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

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FIREBASE_CREDENTIALS } from '../credentials/firebase.credentials';

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { FirebaseAuthService } from './services/firebase/authentication/firebase-auth.service';
import { FirebaseBusinessService } from './services/firebase/businesses/firebase-business.service';
import { PopupsService } from './services/global/popups.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BusinessViewModalPageModule,
    BusinessPrefsModalPageModule,
    NotificationsPrefsModalModule,
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFirestoreModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PopupsService,
    NativeStorage,
    NativeGeocoder,
    FirebaseAuthService,
    FirebaseBusinessService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }