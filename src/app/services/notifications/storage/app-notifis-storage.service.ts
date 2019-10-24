import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppNotification } from '../../../models/notifications/AppNotification';

@Injectable({
  providedIn: 'root'
})

/**
 * The AppNotifsStorageService provides a way to store AppNotifications locally on a user's device.
 */
export class AppNotifsStorageService {
  private static _notifications: AppNotification[] = [];
  private static readonly storageKey = "notifications";

  /**
   * Creates a new AppNotifsStorageService instance.
   * @param nativeStorage The NativeStorage used to save and load AppNotifications.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Saves the user's notifications onto their device.
   * @param notifications The array of AppNotifications to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async saveNotifs(notifications: AppNotification[]): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(AppNotifsStorageService.storageKey, notifications).then(
      () => didSucceed = true,
      error => console.error('Error storing item', error)
    );

    return didSucceed;
  }

  /**
   * Loads the user's notifications stored on their device.
   * @returns A true or false result representing if the load was successful or not respectively.
   */
  public async loadNotifs(): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.getItem(AppNotifsStorageService.storageKey).then(
      data => {
        AppNotifsStorageService._notifications = [];

        data.forEach(element => {
          let notif = new AppNotification(element._title, element._summary, element._severity, new Date(element._dateReceived.rawDate));
          AppNotifsStorageService._notifications.push(notif);
        });

        didSucceed = true;
      },
      error => console.error(error)
    );

    return didSucceed;
  }

  /**
   * The user's current notifications.
   */
  public static get notifications(): AppNotification[] {
    return this._notifications;
  }
}