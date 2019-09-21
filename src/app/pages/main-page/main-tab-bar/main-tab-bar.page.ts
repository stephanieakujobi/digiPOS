/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { Component } from '@angular/core';
import { NotificationsManager } from 'src/app/classes/notifications/NotificationsManager';
import { NotifsManagerEvents } from 'src/app/classes/notifications/NotifsManagerEvent';
import { AppNotification } from 'src/app/classes/notifications/AppNotification';
import { NotificationSeverity } from 'src/app/classes/notifications/NotificationSeverity';

@Component({
  selector: 'app-main-tab-bar',
  templateUrl: 'main-tab-bar.page.html',
  styleUrls: ['main-tab-bar.page.scss']
})

/**
 * The wrapper page containing the main tab bar displayed at the bottom of the app after the user logs in.
 */
export class MainTabBarPage {
  /**
   * Ionic callback function called when the page has finished rendering content.
   * See https://ionicframework.com/docs/angular/lifecycle for more info.
   */
  ionViewDidEnter() {
    NotificationsManager.subscribeTo(NotifsManagerEvents.OnNotifAdded, MainTabBarPage.updateUnreadNotifsBadge);
    this.notifsTest(); //Temporary.
  }

  /**
   * Ionic callback function called when the page has been unloaded.
   * See https://ionicframework.com/docs/angular/lifecycle for more info.
   */
  ionViewDidLeave() {
    NotificationsManager.unsubscribeFrom(NotifsManagerEvents.OnNotifAdded, MainTabBarPage.updateUnreadNotifsBadge);
  }

  /**
   * Updates the number displayed next to the notification tab's bell icon, representing how many unread AppNotifications the user has.
   */
  public static updateUnreadNotifsBadge() {
    const badge = document.getElementById("notifs-badge");
    const unreadNotifsLength = NotificationsManager.notifications.filter(notif => !notif.isRead).length;

    badge.innerText = unreadNotifsLength.toString();

    if(unreadNotifsLength > 0) {
      badge.classList.remove("hidden");
    }
    else {
      badge.classList.add("hidden");
    }
  }

  /**
   * This is a temporary test function for displaying AppNotifications on the Notifications page.
   * Can safely be deleted at any time without breaking any other parts of the application.
   */
  private notifsTest() {
    NotificationsManager.addNotification(new AppNotification(
      "Some Information",
      "Hey there. This notification is just letting you know about something.",
      NotificationSeverity.Information,
      new Date(2019, 8, 12)
    ));

    NotificationsManager.addNotification(new AppNotification(
      "Some Alert",
      "Don't forget about that thing that this notification is reminding you about!",
      NotificationSeverity.Alert,
      new Date(2019, 8, 8)
    ));

    NotificationsManager.addNotification(new AppNotification(
      "Some Error",
      "Uh oh, something went wrong. This notification has the details.",
      NotificationSeverity.Error,
      new Date(2019, 8, 4)
    ));

    setInterval(() => {
      let randInt: number = Math.round(Math.random() * 3);

      if(randInt === 0) {
        NotificationsManager.addNotification(new AppNotification(
          "New Info",
          "Hey there. This is a new notification that will show up every 30 seconds for testing purposes.",
        ));
      }
      else if(randInt == 1) {
        NotificationsManager.addNotification(new AppNotification(
          "New Alert",
          "Hey there. This is a new notification that will show up every 30 seconds for testing purposes.",
          NotificationSeverity.Alert
        ));
      }
      else {
        NotificationsManager.addNotification(new AppNotification(
          "New Error",
          "Hey there. This is a new notification that will show up every 30 seconds for testing purposes.",
          NotificationSeverity.Error
        ));
      }
    },
      30000
    );
  }
}