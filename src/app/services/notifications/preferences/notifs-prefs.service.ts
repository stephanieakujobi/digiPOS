import { Injectable } from '@angular/core';
import { NotifsPrefs } from 'src/app/classes/notifications/NotifsPrefs';
import { PrefsService } from 'src/app/classes/global/PrefsService';

/**
 * The NotifsPrefsService provides a way to save and load user Notification preferences locally on the user's device.
 */
@Injectable({
  providedIn: 'root'
})
export class NotifsPrefsService extends PrefsService<NotifsPrefs> {
  private onUpdatedCallbacks: Function[] = [];

  protected setStorageKey(): string {
    return "notifications_preferences";
  }

  protected instantiateNewPrefs(): NotifsPrefs {
    return new NotifsPrefs();
  }

  public async savePrefs(prefs: NotifsPrefs): Promise<boolean> {
    const didSucceed = super.savePrefs(prefs);

    if(didSucceed) {
      this.onUpdatedCallbacks.forEach(c => c());
    }

    return didSucceed;
  }

  /**
   * Call a function when this NotifsPrefsService updates the users NotifPrefs.
   * @param callback The function to call.
   */
  public subscribeOnUpdated(callback: Function) {
    this.onUpdatedCallbacks.push(callback);
  }
}