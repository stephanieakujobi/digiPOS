import { Component } from "@angular/core";
import { IonItemSliding } from "@ionic/angular";
import { AppNotification } from 'src/app/classes/notifications/AppNotification';
import { MainTabBarPage } from 'src/app/pages/main-page/main-tab-bar/main-tab-bar.page';
import { NotifSeverity } from 'src/app/classes/notifications/NotifSeverity';
import { NotifsPrefsModalPage } from './notifications-prefs-modal/notifications-prefs-modal.page';
import { AppNotifsStorageService } from 'src/app/services/notifications/storage/app-notifis-storage.service';
import { AppNotifsPrefsService } from 'src/app/services/notifications/preferences/app-notifs-prefs.service';
import { PopupsService } from 'src/app/services/global/popups.service';

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
  /**
   * Creates a new NotificationsTabPage.
   * @param prefsService The AppNotifsPrefsService used to update the user's notification preferences when changed.
   * @param popupsService The PopupsService used to display alerts and modals.
   */
  constructor(private prefsService: AppNotifsPrefsService, private popupsService: PopupsService) { }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewDidEnter() {
    this.sortNotifs();
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
      case "info":
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
    await this.popupsService.showAlert(notification.title, notification.summary, "Close");

    notification.isRead = true;
    MainTabBarPage.updateUnreadNotifsBadge();
    this.sortNotifs();
  }

  /**
   * A function called from the page when the user marks an AppNotification as read or unread.
   * Toggles the AppNotification's "isRead" property.
   * @param notification The AppNotification to mark as read or unread.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   */
  toggleNotifRead(notification: AppNotification, ionItemSliding: IonItemSliding) {
    notification.isRead = !notification.isRead;
    MainTabBarPage.updateUnreadNotifsBadge();
    ionItemSliding.close();

    this.sortNotifs();
  }

  /**
   * A funtion called from the page when the user deletes an AppNotification.
   * Checks the user's notification preferences to see if the user should be prompted before deleting the AppNotification.
   * @param notification The AppNotification to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param notifElement The HTMLElement to animate upon deletion.
   */
  async onDeleteNotif(notification: AppNotification, ionItemSliding: HTMLIonItemSlidingElement, notifElement: HTMLElement) {
    console.log(AppNotifsPrefsService.prefs);

    if(AppNotifsPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Notification", "Are you sure you want to delete this notification?",
        () => this.doDeleteNotif(notification, ionItemSliding, notifElement),
        () => ionItemSliding.close()
      );
    }
    else {
      this.doDeleteNotif(notification, ionItemSliding, notifElement);
    }
  }

  /**
   * Called from onDeleteNotif after it has been confirmed that an AppNotification can be deleted.
   * Animates the AppNotification deleting before removing it from storage.
   * @param notification The AppNotification to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param notifElement The HTMLElement to animate upon deletion.
   */
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
  private sortNotifsBySeverity(severity: NotifSeverity) {
    this.notifications.sort(notif => (notif.severity === severity ? -1 : 1));
  }

  /**
   * Called from the page when the user presses the settings icon on the navigation bar.
   * Opens a modal page containing the user preferences for Notifications, allowing the user to edit them.
   * Once the user closes the modal, their notification preferences are saved.
   */
  async openPrefsModal() {
    this.popupsService.showModal(NotifsPrefsModalPage, null, data => {
      console.log(data);
      this.prefsService.savePrefs(data);
    })
  }

  /**
   * Shorthand reference to the AppNotifications stored in AppNotifsStorageService.
   * Required to display AppNotifications on the page via HTML interpolation.
   */
  public get notifications(): AppNotification[] {
    return AppNotifsStorageService.notifications;
  }
}