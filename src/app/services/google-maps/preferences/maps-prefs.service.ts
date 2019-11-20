import { Injectable } from '@angular/core';
import { IAppPrefsService } from 'src/app/interfaces/IAppPrefsService';
import { MapsPrefs } from 'src/app/classes/google-maps/MapsPrefs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class MapsPrefsService implements IAppPrefsService<MapsPrefs> {
  private static readonly storageKey = "maps_preferences";
  private _prefs: MapsPrefs;

  /**
   * Creates a new GoogleMapsPrefsService instance.
   * @param nativeStorage The NativeStorage used to save and load Google Maps preferences.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Loads the user's Google Maps preferences.
   * If there are no pre-existing preferences, a new MapsPrefs object will be created and saved instead.
   * @returns The user's Notification preferences represented in an MapsPrefs object.
   */
  public async loadPrefs() {
    let prefsResult: MapsPrefs;

    await this.nativeStorage.getItem(MapsPrefsService.storageKey).then(
      savedPrefs => {
        prefsResult = savedPrefs;
      },
      error => {
        if(error.exception == null) {
          prefsResult = new MapsPrefs();
        }
      }
    );

    this._prefs = prefsResult;
  }

  /**
   * Updates the user's Google Maps preferences.
   * @param prefs The new set of preferences to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async savePrefs(prefs: MapsPrefs): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(MapsPrefsService.storageKey, prefs)
      .then(() => {
        didSucceed = true;
        this._prefs = prefs;
      });

    return didSucceed;
  }

  /**
   * The user's current Google Maps preferences.
   */
  public get prefs(): MapsPrefs {
    return this._prefs;
  }
}
