import { Injectable } from '@angular/core';
import { PlacesPrefs } from 'src/app/classes/Places/PlacesPrefs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IAppPrefsService } from 'src/app/interfaces/IAppPrefsService';

/**
 * The PlacesPrefsService handles read/write operations on the user's saved Businesses preferences.
 */
@Injectable({
  providedIn: 'root'
})
export class PlacesPrefsService implements IAppPrefsService<PlacesPrefs> {
  private static readonly storageKey = "businesses_preferences";
  private _prefs: PlacesPrefs;

  /**
   * Creates a new PlacesPrefsService instance.
   * @param nativeStorage The NativeStorage used to save and load Places preferences.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Loads the user's Places preferences.
   * If there are no pre-existing preferences, a new PlacesPrefs object will be created and saved instead.
   * @returns The user's Places preferences represented in an PlacesPrefs object.
   */
  public async loadPrefs() {
    let prefsResult: PlacesPrefs;

    await this.nativeStorage.getItem(PlacesPrefsService.storageKey).then(
      savedPrefs => prefsResult = savedPrefs,
      error => {
        if(error.exception == null) {
          prefsResult = new PlacesPrefs();
        }
      }
    );

    this._prefs = prefsResult;
  }

  /**
   * Updates the user's Places preferences.
   * @param prefs The new set of preferences to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async savePrefs(prefs: PlacesPrefs): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(PlacesPrefsService.storageKey, prefs)
      .then(() => {
        didSucceed = true;
        this._prefs = prefs;
      });

    return didSucceed;
  }

  /**
   * The user's current Places preferences.
   */
  public get prefs(): PlacesPrefs {
    return this._prefs;
  }
}