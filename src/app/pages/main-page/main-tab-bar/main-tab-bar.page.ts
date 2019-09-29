/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/29
*/

import { Component } from '@angular/core';
import { AppNotification } from 'src/app/classes/notifications/AppNotification';
import { NotificationsStorageService } from 'src/app/services/notifications-storage.service';

@Component({
  selector: 'app-main-tab-bar',
  templateUrl: 'main-tab-bar.page.html',
  styleUrls: ['main-tab-bar.page.scss']
})

/**
 * The wrapper page containing the main tab bar displayed at the bottom of the app after the user logs in.
 */
export class MainTabBarPage {
  constructor(private notifsStorage: NotificationsStorageService) { }

  /**
   * Ionic callback function called when the page has finished rendering content.
   * See https://ionicframework.com/docs/angular/lifecycle for more info.
   */
  async ionViewDidEnter() {
    // await this.notifsStorage.loadAll();
    // MainTabBarPage.updateUnreadNotifsBadge();

    await this.loadNotifications();
  }

  private async loadNotifications() {
    let notifs: AppNotification[] = [new AppNotification("TITLE", "SUMMARY"), new AppNotification("TITLE 2", "SUMMARY 2")];
    let didSucceed = await this.notifsStorage.saveAll(notifs);

    if(didSucceed) {
      await this.notifsStorage.loadAll();
      MainTabBarPage.updateUnreadNotifsBadge();
    }
  }

  /**
   * Updates the number displayed next to the notification tab's bell icon, representing how many unread AppNotifications the user has.
   */
  public static updateUnreadNotifsBadge() {
    const badge = document.getElementById("notifs-badge") as HTMLIonBadgeElement;
    const unreadNotifsLength = NotificationsStorageService.notifications.filter(notif => !notif.isRead).length;

    badge.innerText = unreadNotifsLength.toString();

    if(unreadNotifsLength > 0) {
      badge.classList.remove("hidden");
    }
    else {
      badge.classList.add("hidden");
    }
  }
}