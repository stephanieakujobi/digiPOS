import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      Environment.setEnv({
        // Api key for your server
        // (Make sure the api key should have Website restrictions for your website domain only)
        //'API_KEY_FOR_BROWSER_RELEASE': 'API-KEY',

        // Api key for local development
        // (Make sure the api key should have Website restrictions for 'http://localhost' only)
        'API_KEY_FOR_BROWSER_DEBUG': ''
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.backButton.observers.pop();
    });
  }
}