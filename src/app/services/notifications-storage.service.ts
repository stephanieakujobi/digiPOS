/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/29
*/

import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppNotification } from '../classes/notifications/AppNotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStorageService {
  private static _notifications: AppNotification[] = [];

  private readonly notifsKey = "notifications";

  constructor(private nativeStorage: NativeStorage) { }

  public async saveAll(notifications: AppNotification[]): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(this.notifsKey, notifications).then(
      () => didSucceed = true,
      error => console.error('Error storing item', error)
    );

    return didSucceed;
  }

  public async loadAll(): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.getItem(this.notifsKey).then(
      data => {
        NotificationsStorageService._notifications = data;
        didSucceed = true;
      },
      error => console.error(error)
    );

    return didSucceed;
  }

  public static get notifications(): AppNotification[] {
    return NotificationsStorageService._notifications;
  }
}