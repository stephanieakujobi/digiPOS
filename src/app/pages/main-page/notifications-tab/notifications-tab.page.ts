/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/29
*/

import { Component } from "@angular/core";
import { AlertController, IonItemSliding, ModalController } from "@ionic/angular";
import { AppNotification } from 'src/app/classes/notifications/AppNotification';
import { MainTabBarPage } from 'src/app/pages/main-page/main-tab-bar/main-tab-bar.page';
import { NotificationSeverity } from 'src/app/classes/notifications/NotificationSeverity';
import { NotificationsSettingsModal } from './notifications-settings/notifications-settings.modal';
import { NotificationSettings } from 'src/app/classes/notifications/NotificationSettings';
import { NotificationsStorageService } from 'src/app/services/notifications-storage.service';

@Component({
  selector: "notifications-home-tab",
  templateUrl: "notifications-tab.page.html",
  styleUrls: ["notifications-tab.page.scss"]
})

/**
 * The page displayed to the user when they select the "Notifications" tab.
 * Shows the user all the AppNotifications they have received, if any.
 */
export class NotificationsTabPage {
  private settings: NotificationSettings;

  /**
   * Creates a new NotificationsTabPage.
   * @param alertController The AlertController used to view AppNotifications in a native alert box.
   */
  constructor(private alertController: AlertController, private modalController: ModalController) {
    this.settings = new NotificationSettings();
  }

  public get notifications(): AppNotification[] {
    return NotificationsStorageService.notifications;
  }

  /**
   * A function called from the page when the user sorts their AppNotifications.
   * Reads the value of the ion-select element on the page and calls the appropriate sort function.
   */
  sortNotifs() {
    const sortSelect = document.getElementById("sort-by-select") as HTMLIonSelectElement;

    switch(sortSelect.value) {
      default:
        this.sortNotifsByNewest();
        break;
      case "oldest":
        this.sortNotifsByOldest();
        break;
      case "unread":
        this.sortNotifsByUnread();
        break;
      case "read":
        this.sortNotifsByRead();
        break;
      case "information":
      case "alert":
      case "error":
        this.sortNotifsBySeverity(sortSelect.value);
        break;
    }
  }

  /**
   * A function called from the page when the user presses on an AppNotification to view its summary.
   * Creates a native alert window containing the summary and displays it to the user, then marks this AppNotification as read.
   * @param notification The AppNotification to display.
   */
  async viewNotif(notification: AppNotification) {
    const notifAlert = await this.alertController.create({
      header: notification.title,
      message: notification.summary,
      buttons: ["Close"]
    });

    await notifAlert.present();

    notification.isRead = true;
    MainTabBarPage.updateUnreadNotifsBadge();
    this.sortNotifs();
  }

  /**
   * A function called from the page when the user marks an AppNotification as read or unread.
   * Toggles the AppNotification's "isRead" property.
   * @param notification The AppNotification to mark as read or unread.
   * @param ionItemSliding The ion-item-sliding element in the page wrapped around the AppNotification to close after the action was performed by the user.
   */
  toggleNotifRead(notification: AppNotification, ionItemSliding: IonItemSliding) {
    notification.isRead = !notification.isRead;
    MainTabBarPage.updateUnreadNotifsBadge();
    ionItemSliding.close();

    this.sortNotifs();
  }

  /**
   * A funtion called from the page when the user deletes an AppNotification.
   * Shrinks the notification in the list before deleting its reference from the NotificationsManager.
   * @param notification The AppNotification to delete.
   * @param ionItemSliding The ion-item-sliding element in the page wrapped around the AppNotification to close after the action was performed by the user.
   * @param notifElement The HTMLElement wrapped around the AppNotification to mark as "deleting". This element will shrink in the list of AppNotifications.
   */
  async deleteNotif(notification: AppNotification, ionItemSliding: HTMLIonItemSlidingElement, notifElement: HTMLElement) {
    if(this.settings.askBeforeDeleteNotif) {
      const confirmationAlert = await this.alertController.create({
        header: "Delete Notification",
        message: "Are you sure you want to delete this notification?",
        buttons: [
          {
            text: "Yes",
            handler: () => this.doDeleteNotif(notification, ionItemSliding, notifElement)
          },
          {
            text: "No",
            role: "cancel",
            handler: () => ionItemSliding.close()
          },
        ]
      });

      await confirmationAlert.present();
    }
    else {
      this.doDeleteNotif(notification, ionItemSliding, notifElement);
    }
  }

  private doDeleteNotif(notification: AppNotification, ionItemSliding: HTMLIonItemSlidingElement, notifElement: HTMLElement) {
    ionItemSliding.close();
    notifElement.classList.add("deleting");

    setTimeout(() => {
      this.notifications.splice(this.notifications.indexOf(notification), 1);
      MainTabBarPage.updateUnreadNotifsBadge();
    }, 300);
  }

  /**
   * Sorts all AppNotifications in the page by the newest "dateReceived" parameter.
   */
  private sortNotifsByNewest() {
    this.notifications.sort((notif1, notif2) => {
      return notif2.dateReceived.rawDate.getTime() - notif1.dateReceived.rawDate.getTime();
    });
  }

  /**
   * Sorts all AppNotifications in the page by the oldest "dateReceived" parameter.
   */
  private sortNotifsByOldest() {
    this.notifications.sort((notif1, notif2) => {
      return notif1.dateReceived.rawDate.getTime() - notif2.dateReceived.rawDate.getTime();
    });
  }

  /**
   * Sorts all AppNotifications in the page by displaying those that are unread at the top of the list.
   */
  private sortNotifsByUnread() {
    this.notifications.sort(notif => (notif.isRead ? 1 : -1));
  }

  /**
   * Sorts all AppNotifications in the page by displaying those that are read at the top of the list.
   */
  private sortNotifsByRead() {
    this.notifications.sort(notif => (!notif.isRead ? 1 : -1));
  }

  /**
   * Sorts all AppNotifications in the page by their severity level.
   * @param severity The NotificationSeverity to sort by, of which the matching AppNotifications will be displayed at the top of the list.
   */
  private sortNotifsBySeverity(severity: NotificationSeverity) {
    this.notifications.sort(notif => (notif.severity === severity ? -1 : 1));
  }

  /**
   * Called from the page when the user presses the settings icon on the navigation bar.
   * Opens a modal page containing the settings for Notifications and passes this object's settings property as a property of the modal.
   */
  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: NotificationsSettingsModal,
      componentProps: {
        settings: this.settings
      }
    });

    return await modal.present();
  }
}