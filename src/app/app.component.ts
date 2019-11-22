import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MapsPrefsService } from './services/google-maps/preferences/maps-prefs.service';
import { PlacesPrefsService } from './services/places/preferences/places-prefs.service';
import { NotifsPrefsService } from './services/notifications/preferences/notifs-prefs.service';
import { NotifsStorageService } from './services/notifications/storage/notifis-storage.service';
import { GlobalServices } from './classes/global/GlobalServices';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidPerms: AndroidPermissions,
    private mapsPrefsService: MapsPrefsService,
    private placesPrefsService: PlacesPrefsService,
    private notifsPrefsService: NotifsPrefsService,
    private notifsStorage: NotifsStorageService
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      GlobalServices.initialize(this.mapsPrefsService, this.placesPrefsService, this.notifsPrefsService, this.notifsStorage);
      this.requestAndroidLocation();

      this.platform.backButton.observers.pop();
    });
  }

  private requestAndroidLocation() {
    this.androidPerms.checkPermission(this.androidPerms.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        if(!result.hasPermission) {
          this.androidPerms.requestPermission(this.androidPerms.PERMISSION.ACCESS_FINE_LOCATION);
        }
      },
      error => this.androidPerms.requestPermission(this.androidPerms.PERMISSION.ACCESS_FINE_LOCATION)
    );
  }
}