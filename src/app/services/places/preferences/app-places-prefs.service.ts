import { Injectable } from '@angular/core';
import { PlacesPrefs } from 'src/app/classes/places/PlacesPrefs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})

/**
 * The AppBusinessesPrefsService handles read/write operations on the user's saved Businesses preferences.
 */
export class AppPlacesPrefsService implements IAppPrefsService<PlacesPrefs> {
  private static readonly storageKey = "businesses_preferences";
  private static _prefs = new PlacesPrefs();

  /**
   * Creates a new AppBusinessesPrefsService instance.
   * @param nativeStorage The NativeStorage used to save and load notifiation preferences.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Loads the user's businesses preferences.
   * If there are no pre-existing preferences, a new AppBusinessesPrefs object will be created and saved instead.
   * @returns The user's businesses preferences represented in an AppBusinessesPrefs object.
   */
  public async loadPrefs(): Promise<PlacesPrefs> {
    let prefsResult: PlacesPrefs;

    await this.nativeStorage.getItem(AppPlacesPrefsService.storageKey).then(
      savedPrefs => prefsResult = savedPrefs,
      error => {
        if(error.exception == null) {
          prefsResult = new PlacesPrefs();
        }
      }
    );

    AppPlacesPrefsService._prefs = prefsResult;
    return prefsResult;
  }

  /**
   * Updates the user's businesses preferences.
   * @param prefs The new set of preferences to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async savePrefs(prefs: PlacesPrefs): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(AppPlacesPrefsService.storageKey, prefs).then(
      () => {
        didSucceed = true;
        AppPlacesPrefsService._prefs = prefs;
      },
      error => console.error('Error saving business prefs', error)
    );

    return didSucceed;
  }

  public static get prefs(): PlacesPrefs {
    return AppPlacesPrefsService._prefs;
  }
}