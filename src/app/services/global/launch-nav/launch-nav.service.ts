import { Injectable } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Platform } from '@ionic/angular';
import { ILatLng, LatLng } from '@ionic-native/google-maps';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';

/**
 * The LaunchNavService is responsible for launching other native maps applications on the user's device.
 * When initialized, it scans the user's device for all applicable apps and stores references to them in an array.
 * The default app to launch is either GoogleMaps if the user's device is running Android, or AppleMaps if the device is running iOS.
 */
@Injectable({
  providedIn: 'root'
})
export class LaunchNavService {
  private static _availableApps: string[] = [];
  private static _defaultApp: string;

  private static platformIsIos: boolean = false;
  private static initialized: boolean = false;

  /**
   * Creates a new LaunchNavService.
   * @param launchNavigator The LaunchNavigator used to launch other native maps apps on the user's device.
   * @param platform The Platform used to detect which operating system the user's device is running.
   */
  constructor(private launchNavigator: LaunchNavigator, platform: Platform) {
    if(!LaunchNavService.initialized) {
      LaunchNavService.initialize(launchNavigator, platform);
    }
  }

  /**
   * Initializes the available and default maps applications when this object is created.
   * @param ln The LaunchNavigator used to scan the user's device for applicable maps apps.
   * @param platform The Platform used to detect which operating system the user's device is running.
   */
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

  /**
   * Launches a native maps app specified by the "prefsMapsApp" value of the user's global MapsPrefs, and starts a route from the startLocation to the destinationAddress.
   * @param startLocation The start location to start the route.
   * @param destinationAddress The destination to end the route.
   * @param onError The callbak to run if an error occurs while launching the app.
   */
  public launchMapsApp(startLocation: ILatLng | LatLng, destinationAddress: string, onError: (error: any) => void) {
    let options: LaunchNavigatorOptions = {
      app: GlobalServices.mapsPrefsService.prefs.prefMapsApp,
      start: `${startLocation.lat}, ${startLocation.lng}`
    }

    this.launchNavigator.navigate(destinationAddress, options).catch(err => onError(err));
  }

  /**
   * Formats the name of an available maps app for display.
   * @param app The app name
   * @returns The display-name of the app.
   * 
   * Interpolated in maps-prefs-modal.page.html
   */
  public getAppDisplayName(app: string): string {
    return this.launchNavigator.getAppDisplayName(app);
  }

  /**
   * The array of all available maps apps that can be launched on the user's device.
   * Interpolated in maps-prefs-modal.page.html
   */
  public get availableApps(): string[] {
    return LaunchNavService._availableApps;
  }

  /**
   * The default available maps app that can be launched on the user's device.
   */
  public get defaultApp(): string {
    return LaunchNavService._defaultApp;
  }
}