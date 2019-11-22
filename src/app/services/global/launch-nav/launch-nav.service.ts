import { Injectable } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Platform } from '@ionic/angular';
import { ILatLng } from '@ionic-native/google-maps';

@Injectable({
  providedIn: 'root'
})
export class LaunchNavService {
  private static _availableApps: string[] = [];
  private static _defaultApp: string;

  private static platformIsIos: boolean = false;
  private static initialized: boolean = false;

  constructor(private launchNavigator: LaunchNavigator, platform: Platform) {
    if(!LaunchNavService.initialized) {
      LaunchNavService.initialize(launchNavigator, platform);
    }
  }

  private static async initialize(ln: LaunchNavigator, platform: Platform) {
    this.platformIsIos = platform.platforms().includes("ios");

    const apps: any = await ln.availableApps();

    Object.keys(apps).forEach(key => {
      if(!apps[key]) {
        delete apps[key];
      }
    });

    Object.keys(apps).forEach(key => {
      this._availableApps.push(key);
    });

    this._defaultApp = LaunchNavService.platformIsIos ? ln.APP.APPLE_MAPS : ln.APP.GOOGLE_MAPS;

    this.initialized = true;
  }

  public getAppDisplayName(app: string) {
    return this.launchNavigator.getAppDisplayName(app);
  }

  public get availableApps(): string[] {
    return LaunchNavService._availableApps;
  }

  public get defaultApp(): string {
    return LaunchNavService._defaultApp;
  }
}