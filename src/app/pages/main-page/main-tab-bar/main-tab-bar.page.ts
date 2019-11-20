import { Component, OnInit } from '@angular/core';
import { NotifsStorageService } from 'src/app/services/notifications/storage/notifis-storage.service';
import { NavController } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { PlacesPrefsService } from 'src/app/services/places/preferences/places-prefs.service';
import { NotifsPrefsService } from 'src/app/services/notifications/preferences/notifs-prefs.service';
import { NotifsGeneratorService } from 'src/app/services/notifications/generator/notifs-generator.service';
import { MapsPrefsService } from 'src/app/services/google-maps/preferences/maps-prefs.service';

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
   * @param mapsPrefsService The MapsPrefsService used to load the user's saved Google Maps preferences.
   * @param placesPrefsService The PlacesPrefsService used to load the user's saved Places preferences.
   * @param notifsPrefsService The NotifsPrefsService used to load the user's saved Notifications preferences.
   * @param notifsStorage The NotifsStorageService used to load the user's saved Notifications on their device.
   * @param notifsGenerator The NotifsGeneratorService used to initialize Notification generation processes.
   */
  constructor(
    private navController: NavController,
    private mapsPrefsService: MapsPrefsService,
    private placesPrefsService: PlacesPrefsService,
    private notifsPrefsService: NotifsPrefsService,
    private notifsStorage: NotifsStorageService,
    private notifsGenerator: NotifsGeneratorService,
  ) { }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  async ionViewWillEnter() {
    if(!FirebaseAuthService.userIsAuthenticated) {
      this.navController.navigateBack("/login");
    }
    else {
      await this.loadUserData();
      MainTabBarPage.updateUnreadNotifsBadge();
      this.notifsGenerator.subscribeOnNotifGenerated(MainTabBarPage.updateUnreadNotifsBadge);
      this.notifsGenerator.watchProcesses();
    }
  }

  /**
   * Asynchronously loads all of the user's various preferences and saved data on their device. 
   */
  private async loadUserData() {
    await this.mapsPrefsService.loadPrefs();
    await this.placesPrefsService.loadPrefs();
    await this.notifsPrefsService.loadPrefs();
    await this.notifsStorage.loadNotifs();
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