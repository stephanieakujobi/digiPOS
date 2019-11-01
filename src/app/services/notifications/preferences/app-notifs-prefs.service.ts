import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppNotifsPrefs } from 'src/app/classes/notifications/AppNotifsPrefs';

@Injectable({
  providedIn: 'root'
})

/**
 * The AppNotifsPrefsService provides a way to save and load user notification preferences locally on the user's device.
 */
export class AppNotifsPrefsService implements IAppPrefsService<AppNotifsPrefs> {
  private static readonly storageKey = "notifications_preferences";
  private static _prefs = new AppNotifsPrefs();

  /**
   * Creates a new AppNotifsPrefsService instance.
   * @param nativeStorage The NativeStorage used to save and load notifiation preferences.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Loads the user's notification preferences.
   * If there are no pre-existing preferences, a new AppNotifsPrefs object will be created and saved instead.
   * @returns The user's notification preferences represented in an AppNotifsPrefs object.
   */
  public async loadPrefs(): Promise<AppNotifsPrefs> {
    let prefsResult: AppNotifsPrefs;

    await this.nativeStorage.getItem(AppNotifsPrefsService.storageKey).then(
      savedPrefs => {
        prefsResult = savedPrefs;
      },
      error => {
        if(error.exception == null) {
          prefsResult = new AppNotifsPrefs();
        }
      }
    );

    AppNotifsPrefsService._prefs = prefsResult;
    return prefsResult;
  }

  /**
   * Updates the user's notification preferences.
   * @param prefs The new set of preferences to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async savePrefs(prefs: AppNotifsPrefs): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(AppNotifsPrefsService.storageKey, prefs).then(
      () => {
        didSucceed = true;
        AppNotifsPrefsService._prefs = prefs;
      },
      error => console.error('Error storing item', error)
    );

    return didSucceed;
  }

  public static get prefs() {
    return AppNotifsPrefsService._prefs;
  }
}
