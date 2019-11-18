import { Component, OnInit } from '@angular/core';
import { NotifsStorageService } from 'src/app/services/notifications/storage/notifis-storage.service';
import { NavController } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { PlacesPrefsService } from 'src/app/services/places/preferences/places-prefs.service';
import { NotifsPrefsService } from 'src/app/services/notifications/preferences/notifs-prefs.service';
import { NotifsGeneratorService } from 'src/app/services/notifications/generator/notifs-generator.service';

/**
 * The wrapper page containing the main tab bar displayed at the bottom of the app after the user logs in.
 * This page is also the parent page to all the pages within each tab.
 */
@Component({
  selector: 'app-main-tab-bar',
  templateUrl: 'main-tab-bar.page.html',
  styleUrls: ['main-tab-bar.page.scss']
})
export class MainTabBarPage implements OnInit {
  /**
   * Creates a new MainTabBarPage
   * @param navController The NavController used to redirect the user back to the LoginPage if they are not authenticated.
   * @param notifsStorage The NotifsStorageService used to load the user's saved Notifications on their device.
   * @param placesPrefsService The PlacesPrefsService used to load the user's saved Places preferences.
   * @param notifsPrefsService The NotifsPrefsService used to load the user's saved Notifications preferences.
   */
  constructor(
    private navController: NavController,
    private notifsStorage: NotifsStorageService,
    private placesPrefsService: PlacesPrefsService,
    private notifsPrefsService: NotifsPrefsService,
    private notifsGenerator: NotifsGeneratorService,
  ) { }

  ngOnInit() {
    if(!FirebaseAuthService.userIsAuthenticated) {
      this.navController.navigateBack("/login");
    }
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  async ionViewWillEnter() {
    await this.placesPrefsService.loadPrefs();
    await this.notifsPrefsService.loadPrefs();
    await this.loadNotifications();

    this.notifsGenerator.subscribeOnNotifGenerated(MainTabBarPage.updateUnreadNotifsBadge);
    this.notifsGenerator.watchProcesses();
  }

  /**
   * Loads the user's saved Notifications upon successful login.
   */
  private async loadNotifications() {
    await this.notifsStorage.loadNotifs();
    MainTabBarPage.updateUnreadNotifsBadge();
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