import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Notification } from 'src/app/classes/notifications/Notification';

@Injectable({
  providedIn: 'root'
})

/**
 * The AppNotifsStorageService provides a way to store Notifications locally on a user's device.
 */
export class NotifsStorageService {
  private static _notifications: Notification[] = [];
  private static readonly storageKey = "notifications";

  /**
   * Creates a new AppNotifsStorageService instance.
   * @param nativeStorage The NativeStorage used to save and load Notifications.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Saves the user's notifications onto their device.
   * @param notifications The array of Notifications to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async saveNotifs(notifications: Notification[]): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(NotifsStorageService.storageKey, notifications)
      .then(() => didSucceed = true);

    return didSucceed;
  }

  /**
   * Loads the user's notifications stored on their device.
   * @returns A true or false result representing if the load was successful or not respectively.
   */
  public async loadNotifs(): Promise<boolean> {
    let didSucceed: boolean = false;
    NotifsStorageService._notifications = [];

    await this.nativeStorage.getItem(NotifsStorageService.storageKey).then(
      data => {
        data.forEach((element: any) => {
          const notif = new Notification(element._title, element._summary, element._severity, new Date(element._dateReceived));
          NotifsStorageService._notifications.push(notif);
        });

        didSucceed = true;
      }
    );

    return didSucceed;
  }

  /**
   * The user's current notifications.
   */
  public static get notifications(): Notification[] {
    return this._notifications;
  }
}