import { Component } from '@angular/core';
import { NotifsStorageService } from 'src/app/services/notifications/storage/notifis-storage.service';
import { NavController } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { NotifsGeneratorService } from 'src/app/services/notifications/generator/notifs-generator.service';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';

/**
 * The wrapper page containing the main tab bar displayed at the bottom of the app after the user successfully logs in.
 * This page is also the parent page to all the pages within each tab.
 */
@Component({
  selector: 'app-main-tab-bar',
  templateUrl: 'main-tab-bar.page.html',
  styleUrls: ['main-tab-bar.page.scss']
})
export class MainTabBarPage {
  /**
   * Creates a new MainTabBarPage
   * @param navController The NavController used to redirect the user back to the LoginPage if they are not authenticated.
   */
  constructor(private navController: NavController) { }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  async ionViewWillEnter() {
    if(!FirebaseAuthService.userIsAuthenticated) {
      this.navController.navigateBack("/login");
    }
    else {
      MainTabBarPage.updateUnreadNotifsBadge();
      NotifsGeneratorService.subscribeOnNotifGenerated(() => MainTabBarPage.updateUnreadNotifsBadge());
      GlobalServices.notifsGeneratorService.watchProcesses();
    }
  }

  /**
   * Updates the number displayed next to the Notifications tab's bell icon, representing how many unread Notifications the user has.
   */
  public static updateUnreadNotifsBadge() {
    const badge = document.getElementById("notifs-badge") as HTMLIonBadgeElement;
    const unreadNotifsLength = NotifsStorageService.notifications.filter(notif => !notif.isRead).length;

    badge.innerText = unreadNotifsLength.toString();

    if(unreadNotifsLength > 0) {
      badge.classList.remove("zero-notifs");
    }
    else {
      badge.classList.add("zero-notifs");
    }
  }
}