import { Injectable } from '@angular/core';
import { MapsPrefs } from 'src/app/classes/google-maps/MapsPrefs';
import { PrefsService } from 'src/app/classes/global/PrefsService';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LaunchNavService } from '../../global/launch-nav/launch-nav.service';

@Injectable({
  providedIn: 'root'
})
export class MapsPrefsService extends PrefsService<MapsPrefs> {
  constructor(nativeStorage: NativeStorage, private launchNavService: LaunchNavService) {
    super(nativeStorage);
  }

  protected setStorageKey(): string {
    return "maps_preferences";
  }

  protected instantiateNewPrefs(): MapsPrefs {
    return new MapsPrefs(this.launchNavService.defaultApp);
  }
}