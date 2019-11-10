import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NotifsPrefs } from 'src/app/classes/notifications/NotifsPrefs';
import { IAppPrefsService } from 'src/app/interfaces/IAppPrefsService';

@Injectable({
  providedIn: 'root'
})

/**
 * The NotifsPrefsService provides a way to save and load user Notification preferences locally on the user's device.
 */
export class NotifsPrefsService implements IAppPrefsService<NotifsPrefs> {
  private static readonly storageKey = "notifications_preferences";
  private static _prefs = new NotifsPrefs();

  private onUpdatedCallbacks: Function[];

  /**
   * Creates a new NotifsPrefsService instance.
   * @param nativeStorage The NativeStorage used to save and load notifiation preferences.
   */
  constructor(private nativeStorage: NativeStorage) {
    this.onUpdatedCallbacks = [];
  }

  /**
   * Loads the user's Notification preferences.
   * If there are no pre-existing preferences, a new AppNotifsPrefs object will be created and saved instead.
   * @returns The user's Notification preferences represented in an AppNotifsPrefs object.
   */
  public async loadPrefs() {
    let prefsResult: NotifsPrefs;

    await this.nativeStorage.getItem(NotifsPrefsService.storageKey).then(
      savedPrefs => {
        prefsResult = savedPrefs;
      },
      error => {
        if(error.exception == null) {
          prefsResult = new NotifsPrefs();
        }
      }
    );

    NotifsPrefsService._prefs = prefsResult;
  }

  /**
   * Updates the user's Notification preferences.
   * @param prefs The new set of preferences to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async savePrefs(prefs: NotifsPrefs): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(NotifsPrefsService.storageKey, prefs)
      .then(() => {
        didSucceed = true;
        NotifsPrefsService._prefs = prefs;
      });

    if(didSucceed) {
      this.onUpdatedCallbacks.forEach(c => c());
    }

    return didSucceed;
  }

  public subscribeOnUpdated(callback: Function) {
    this.onUpdatedCallbacks.push(callback);
  }

  /**
   * The user's current Notification preferences.
   */
  public static get prefs() {
    return NotifsPrefsService._prefs;
  }
}
