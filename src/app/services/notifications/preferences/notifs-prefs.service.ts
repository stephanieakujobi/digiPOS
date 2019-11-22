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
  protected setStorageKey(): string {
    return "notifications_preferences";
  }

  protected instantiateNewPrefs(): NotifsPrefs {
    return new NotifsPrefs();
  }
}