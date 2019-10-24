import { Injectable } from '@angular/core';
import { AppBusinessesPrefs } from 'src/app/models/businesses/AppBusinessesPrefs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppBusinessesPrefsService implements IAppPrefsService<AppBusinessesPrefs> {
  private static readonly storageKey = "businesses_preferences";

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
  public async loadPrefs(): Promise<AppBusinessesPrefs> {
    let prefsResult: AppBusinessesPrefs;

    await this.nativeStorage.getItem(AppBusinessesPrefsService.storageKey).then(
      savedPrefs => prefsResult = savedPrefs,
      error => {
        if(error.exception == null) {
          prefsResult = new AppBusinessesPrefs();
        }
      }
    );

    return prefsResult;
  }

  /**
   * Updates the user's businesses preferences.
   * @param prefs The new set of preferences to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async savePrefs(prefs: AppBusinessesPrefs): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(AppBusinessesPrefsService.storageKey, prefs).then(
      () => {
        didSucceed = true;
      },
      error => console.error('Error saving business prefs', error)
    );

    return didSucceed;
  }
}