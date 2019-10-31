import { Component, OnInit } from '@angular/core';
import { AppNotification } from 'src/app/classes/notifications/AppNotification';
import { AppNotifsStorageService } from 'src/app/services/notifications/storage/app-notifis-storage.service';
import { AppNotifSeverity } from 'src/app/classes/notifications/AppNotifSeverity';
import { NavController } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';

@Component({
  selector: 'app-main-tab-bar',
  templateUrl: 'main-tab-bar.page.html',
  styleUrls: ['main-tab-bar.page.scss']
})

/**
 * The wrapper page containing the main tab bar displayed at the bottom of the app after the user logs in.
 * This page is also the parent page to all the pages within each tab.
 */
export class MainTabBarPage implements OnInit {

  /**
   * Creates a new MainTabBarPage
   * @param navController The NavController used to redirect the user back to the LoginPage if they are not authenticated.
   * @param notifsStorage The AppNotifsStorageService used to load the user's saved AppNotifications on their device.
   */
  constructor(private navController: NavController, private notifsStorage: AppNotifsStorageService) { }

  async ngOnInit() {
    if(!FirebaseAuthService.userIsAuthenticated) {
      // this.navController.navigateBack("/login");
    }
    else {
      await this.testSaveNotifs(); //TEMPORARY
      await this.loadNotifications();
    }
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
      badge.classList.remove("zero-notifs");
    }
    else {
      badge.classList.add("zero-notifs");
    }
  }
}