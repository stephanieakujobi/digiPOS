import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Notification } from 'src/app/classes/notifications/Notification';

/**
 * The NotifsStorageService provides a way to store Notifications locally on a user's device.
 */
@Injectable({
  providedIn: 'root'
})
export class NotifsStorageService {
  private static _notifications: Notification[] = [];
  private static readonly storageKey = "notifications";

  /**
   * Creates a new NotifsStorageService instance.
   * @param nativeStorage The NativeStorage used to save and load Notifications.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Saves the user's Notifications onto their device.
   * @param notifications The array of Notifications to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async saveNotifs(notifications: Notification[]): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(NotifsStorageService.storageKey, notifications)
      .then(() => {
        didSucceed = true;
        NotifsStorageService._notifications = notifications;
      });

    return didSucceed;
  }

  /**
   * Loads the user's Notifications stored on their device.
   * @returns A true or false result representing if the load was successful or not respectively.
   */
  public async loadNotifs(): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.getItem(NotifsStorageService.storageKey)
      .then(data => {
        NotifsStorageService._notifications = [];

        data.forEach((element: any) => {
          const notif = new Notification(element._title, element._summary, element._severity, new Date(element._dateReceived));
          notif.isRead = element._isRead;
          NotifsStorageService._notifications.push(notif);
        });

        didSucceed = true;
      })
      .catch(() => NotifsStorageService._notifications = []);

    return didSucceed;
  }

  /**
   * Stores a new Notification locally on the user's device.
   * @param notif The Notification to store.
   * @returns A true/false value indicating if storage was successful or not.
   */
  public async addNotif(notif: Notification): Promise<boolean> {
    const notifications = NotifsStorageService.notifications;
    notifications.push(notif);
    return await this.saveNotifs(notifications);
  }

  /**
   * Deletes an existing Notification stored locally on the user's device.
   * @param notif The Notification to delete.
   * @returns A true/false value indicating if deletion was successful or not.
   */
  public async deleteNotif(notif: Notification): Promise<boolean> {
    const notifications = NotifsStorageService.notifications;
    notifications.splice(notifications.indexOf(notif), 1);
    return await this.saveNotifs(notifications);
  }

  /**
   * Searches the user's stored Notifications for one with a matching title & summary to the provided Notification.
   * @param notif The Notification to compare.
   * @returns A true/false value indicating if the Notification exists in the user's stored Notifications.
   */
  public hasNotif(notif: Notification): boolean {
    let result = false;

    for(const existingNotif of NotifsStorageService.notifications) {
      if(existingNotif.title == notif.title && existingNotif.summary == notif.summary) {
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * The user's current Notifications stored on their device.
   */
  public static get notifications(): Notification[] {
    return this._notifications;
  }
}