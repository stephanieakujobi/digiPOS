import { Component } from '@angular/core';
import { AppNotification } from 'src/app/classes/notifications/AppNotification';
import { AppNotifsStorageService } from 'src/app/services/notifications/storage/app-notifis-storage.service';
import { AppNotifSeverity } from 'src/app/classes/notifications/AppNotifSeverity';
import { SavedBusinessesStorageService } from 'src/app/services/businesses/storage/saved-businesses-storage.service';
import { Business } from 'src/app/classes/businesses/Business';
import { Address } from 'src/app/classes/businesses/Address';

@Component({
  selector: 'app-main-tab-bar',
  templateUrl: 'main-tab-bar.page.html',
  styleUrls: ['main-tab-bar.page.scss']
})

/**
 * The wrapper page containing the main tab bar displayed at the bottom of the app after the user logs in.
 */
export class MainTabBarPage {
  constructor(private businessesStorage: SavedBusinessesStorageService, private notifsStorage: AppNotifsStorageService) { }

  /**
   * Ionic callback function called when the page has finished rendering content.
   * See https://ionicframework.com/docs/angular/lifecycle for more info.
   */
  async ionViewDidEnter() {
    await this.testSaveNotifs(); //TEMPORARY

    await this.businessesStorage.loadBusinesses();
    await this.loadNotifications();
  }

  /**
   * TEMPORARY TEST METHOD.
   */
  private async testSaveNotifs() {
    let notifs: AppNotification[] = [
      new AppNotification("TITLE", "SUMMARY"),
      new AppNotification("TITLE 2", "SUMMARY 2"),
      new AppNotification("TITLE 3", "SUMMARY 3", AppNotifSeverity.Alert, new Date(2019, 10, 20)),
      new AppNotification("TITLE 4", "SUMMARY 4", AppNotifSeverity.Error, new Date(2019, 10, 10))
    ];

    await this.notifsStorage.saveNotifs(notifs);
  }

  /**
   * Loads the user's saved notifications upon successful login.
   */
  private async loadNotifications() {
    await this.notifsStorage.loadNotifs();
    MainTabBarPage.updateUnreadNotifsBadge();
  }

  /**
   * Updates the number displayed next to the notification tab's bell icon, representing how many unread AppNotifications the user has.
   */
  public static updateUnreadNotifsBadge() {
    const badge = document.getElementById("notifs-badge") as HTMLIonBadgeElement;
    const unreadNotifsLength = AppNotifsStorageService.notifications.filter(notif => !notif.isRead).length;

    badge.innerText = unreadNotifsLength.toString();

    if(unreadNotifsLength > 0) {
      badge.classList.remove("hidden");
    }
    else {
      badge.classList.add("hidden");
    }
  }
}