import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapsPrefsModalPageModule } from './pages/main-page/home-tab/maps-prefs-modal/maps-prefs-modal/maps-prefs-modal.module';
import { NotificationsPrefsModalModule } from './pages/main-page/notifications-tab/notifications-prefs-modal/notifications-prefs-modal.module';
import { PlaceViewModalPageModule } from './pages/main-page/places-tab/place-view-modal/place-view-modal.module';
import { PlacesPrefsModalPageModule } from './pages/main-page/places-tab/places-prefs/places-prefs-modal.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FIREBASE_CREDENTIALS } from '../credentials/firebase.credentials';

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FirebaseAuthService } from './services/firebase/authentication/firebase-auth.service';
import { FirebasePlacesService } from './services/firebase/places/firebase-places.service';
import { PopupsService } from './services/global/popups.service';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MapsPrefsModalPageModule,
    PlaceViewModalPageModule,
    PlacesPrefsModalPageModule,
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
    FirebasePlacesService,
    LaunchNavigator,
    LocalNotifications,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }