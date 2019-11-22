import { Injectable } from '@angular/core';
import { MapsPrefs } from 'src/app/classes/google-maps/MapsPrefs';
import { PrefsService } from 'src/app/classes/global/PrefsService';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MapsPrefsService extends PrefsService<MapsPrefs> {
  constructor(nativeStorage: NativeStorage, private launchNavigator: LaunchNavigator, private platform: Platform) {
    super(nativeStorage);
  }

  protected setStorageKey(): string {
    return "maps_preferences";
  }

  protected instantiateNewPrefs(): MapsPrefs {
    return new MapsPrefs(this.platform.platforms().includes("ios") ? this.launchNavigator.APP.APPLE_MAPPS : this.launchNavigator.APP.GOOGLE_MAPS);
  }
}