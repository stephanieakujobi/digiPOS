import { Component } from "@angular/core";
import { IonItemSliding } from "@ionic/angular";
import { Notification } from 'src/app/classes/notifications/Notification';
import { MainTabBarPage } from 'src/app/pages/main-page/main-tab-bar/main-tab-bar.page';
import { NotifSeverity } from 'src/app/classes/notifications/NotifSeverity';
import { NotifsPrefsModalPage } from './notifications-prefs-modal/notifications-prefs-modal.page';
import { NotifsStorageService } from 'src/app/services/notifications/storage/notifis-storage.service';
import { PopupsService } from 'src/app/services/global/popups/popups.service';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';
import { NotifsGeneratorService } from 'src/app/services/notifications/generator/notifs-generator.service';

/**
 * The page displayed to the user when they select the Notifications tab.
 * Shows the user all the Notifications they have received, if any.
 */
@Component({
  selector: "notifications-home-tab",
  templateUrl: "notifications-tab.page.html",
  styleUrls: ["notifications-tab.page.scss"]
})
export class NotificationsTabPage {
  /**
   * Creates a new NotificationsTabPage.
   * @param popupsService The PopupsService used to display alerts and modals.
   */
  constructor(private popupsService: PopupsService) {
    NotifsGeneratorService.subscribeOnNotifGenerated(() => this.sortNotifs());
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewDidEnter() {
    this.sortNotifs();
  }

  /**
   * A function called from the page when the user sorts their Notifications.
   * Reads the value of the ion-select element on the page and calls the appropriate sort function.
   */
  sortNotifs() {
    const sortSelect = document.getElementById("sort-by-select") as HTMLIonSelectElement;

    if(sortSelect != null) {
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

        // UNUSED
        // case "info":
        // case "alert":
        // case "error":
        //   this.sortNotifsBySeverity(sortSelect.value);
        //   break;
      }
    }
  }

  /**
   * A function called from the page when the user presses on a Notification to view its summary.
   * Creates a native alert window containing the summary and displays it to the user, then marks this Notification as read.
   * @param notification The Notification to display.
   */
  async viewNotif(notification: Notification) {
    await this.popupsService.showAlert(notification.title, notification.summary, "Close");

    notification.isRead = true;
    MainTabBarPage.updateUnreadNotifsBadge();
    this.sortNotifs();
  }

  /**
   * A function called from the page when the user marks a Notification as read or unread.
   * Toggles the Notification's "isRead" property.
   * @param notification The Notification to mark as read or unread.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   */
  async toggleNotifRead(notification: Notification, ionItemSliding: IonItemSliding) {
    notification.isRead = !notification.isRead;
    const toggleSuccess = await GlobalServices.notifsStorageService.saveNotifs(this.notifications);

    if(toggleSuccess) {
      MainTabBarPage.updateUnreadNotifsBadge();
      ionItemSliding.close();
      this.sortNotifs();
    }
  }

  /**
   * A funtion called from the page when the user deletes a Notification.
   * Checks the user's notification preferences to see if the user should be prompted before deleting the Notification.
   * @param notification The Notification to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param notifElement The HTMLElement to animate upon deletion.
   */
  async onDeleteNotif(notification: Notification, ionItemSliding: HTMLIonItemSlidingElement, notifElement: HTMLElement) {
    const deleteNotif = () => {
      ionItemSliding.close();
      notifElement.classList.add("deleting");

      setTimeout(async () => {
        const deleteSuccess = await GlobalServices.notifsStorageService.deleteNotif(notification);

        if(deleteSuccess) {
          this.sortNotifs();
          MainTabBarPage.updateUnreadNotifsBadge();
        }
      }, 300);
    }

    if(GlobalServices.notifsPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Notification", "Are you sure you want to delete this notification?",
        () => deleteNotif(),
        () => ionItemSliding.close()
      );
    }
    else {
      deleteNotif();
    }
  }

  // /**
  //  * Called from onDeleteNotif after it has been confirmed that a Notification can be deleted.
  //  * Animates the Notification deleting before removing it from storage.
  //  * @param notification The Notification to delete.
  //  * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
  //  * @param notifElement The HTMLElement to animate upon deletion.
  //  */
  // private doDeleteNotif(notification: Notification, ionItemSliding: HTMLIonItemSlidingElement, notifElement: HTMLElement) {
  //   ionItemSliding.close();
  //   notifElement.classList.add("deleting");

  //   setTimeout(async () => {
  //     const deleteSuccess = await GlobalServices.notifsStorageService.deleteNotif(notification);
  //     if(deleteSuccess) {
  //       MainTabBarPage.updateUnreadNotifsBadge();
  //     }
  //   }, 300);
  // }

  /**
   * Sorts all Notifications in the page by the newest "dateReceived" parameter.
   */
  private sortNotifsByNewest() {
    this.notifications.sort((notif1, notif2) => {
      return notif2.dateReceived.getTime() - notif1.dateReceived.getTime();
    });
  }

  /**
   * Sorts all Notifications in the page by the oldest "dateReceived" parameter.
   */
  private sortNotifsByOldest() {
    this.notifications.sort((notif1, notif2) => {
      return notif1.dateReceived.getTime() - notif2.dateReceived.getTime();
    });
  }

  /**
   * Sorts all Notifications in the page by displaying those that are unread at the top of the list.
   */
  private sortNotifsByUnread() {
    this.notifications.sort(notif => (notif.isRead ? 1 : -1));
  }

  /**
   * Sorts all Notifications in the page by displaying those that are read at the top of the list.
   */
  private sortNotifsByRead() {
    this.notifications.sort(notif => (!notif.isRead ? 1 : -1));
  }

  /**
   * Called from the page when the user presses the settings icon on the navigation bar.
   * Opens a modal page containing the user preferences for Notifications, allowing the user to edit them.
   * Once the user closes the modal, their Notification preferences are saved.
   */
  async openPrefsModal() {
    this.popupsService.showModal(NotifsPrefsModalPage);
  }

  /**
   * Shorthand reference to the Notifications stored in NotifsStorageService.
   */
  public get notifications(): Notification[] {
    return NotifsStorageService.notifications;
  }

  // UNUSED
  // /**
  //  * Sorts all Notifications in the page by their severity level.
  //  * @param severity The NotificationSeverity to sort by, of which the matching Notifications will be displayed at the top of the list.
  //  */
  // private sortNotifsBySeverity(severity: NotifSeverity) {
  //   this.notifications.sort(notif => (notif.severity === severity ? -1 : 1));
  // }
}