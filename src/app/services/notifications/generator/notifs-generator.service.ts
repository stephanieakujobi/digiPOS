import { Injectable } from '@angular/core';
import { TriggerProcess } from 'src/app/classes/notifications/TriggerProcess';
import { Notification } from 'src/app/classes/notifications/Notification';
import { FirebasePlacesService } from '../../firebase/places/firebase-places.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';
import { NotifsPrefsService } from '../preferences/notifs-prefs.service';
import { Place } from 'src/app/models/places/Place';

/**
 * The NotifsGeneratorService watches for various events and sends the user Notifications where applicable.
 */
@Injectable({
  providedIn: 'root'
})
export class NotifsGeneratorService {
  private static onGeneratedCallbacks: Function[] = [];
  private processes: TriggerProcess[];

  /**
   * Creates a new NotifsGeneratorService
   * @param fbpService The FirebasePlacesService used to monitor the user's saved Places and send notifications based on them in certain contexts.
   * @param vibration The Vibration service used to vibrate the user's device when receiving a Notification, if their preferences allow for it.
   * @param localNotifs The LocalNotifications used to show push notifications on the user's device, if their preferences allow for it.
   * @param navController The NavController used to navigate to the NotificationsPage when the user clicks on a push notification.
   */
  constructor(
    private fbpService: FirebasePlacesService,
    private vibration: Vibration,
    private localNotifs: LocalNotifications,
    private navController: NavController
  ) {
    this.processes = [];

    this.addPlacesNotUpdatedProcess();
    NotifsPrefsService.subscribeOnUpdated(() => this.watchProcesses());
  }

  /**
   * Tells all TriggerProcesses to start watching for contexts to create Notitications with.
   * If the user's NotifPrefs have Notifications disabled, then all processes are stopped instead.
   */
  public watchProcesses() {
    if(GlobalServices.notifsPrefsService.prefs.enableNotifs) {
      this.processes.forEach(p => p.start());
    }
    else {
      this.processes.forEach(p => p.stop());
    }
  }

  /**
   * Creates a new TriggerProcess that monitors the user's saved Places, checking how long ago each Place was updated by the User.
   * The user will be notified for any saved Places that are not reported and have not been updated for 7+ days.
   * This TriggerProcess only runs once upon starting the app.
   */
  private addPlacesNotUpdatedProcess() {
    const process = new TriggerProcess(() => {
      for(const place of this.fbpService.savedPlaces.filter(p => !p.isReported)) {
        const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(place.dateUpdated).getTime()) / 8.64e+7);

        if(daysSinceUpdate > 6) {
          this.addNotification(new Notification(
            `Reminder to visit ${place.info.name}`,
            `It has been ${daysSinceUpdate} days since you have last updated ${place.info.name}. Why not pay them a visit?`,
            "info",
          ));
        }
      }
    });

    this.processes.push(process);
  }

  public generatePlaceDeleted(place: Place) {
    this.addNotification(new Notification(
      `${place.info.name} was deleted`,
      `"${place.info.name}" at ${place.info.address.addressString} was deleted from your saved places.`,
      "info"
    ));
  }

  /**
   * Creates and locally stores a new Notification, then calls each type of alert function to alert the user of the new Notification.
   * @param notif The Notification to add.
   */
  private async addNotification(notif: Notification) {
    if(GlobalServices.notifsPrefsService.prefs.enableNotifs && !GlobalServices.notifsStorageService.hasNotif(notif)) {
      const addSuccess = await GlobalServices.notifsStorageService.addNotif(notif);

      if(addSuccess) {
        this.sendPushNotification(notif);
        this.vibrateDevice();
        NotifsGeneratorService.onGeneratedCallbacks.forEach(c => c());
      }
    }
  }

  /**
   * Sends a push notification to the user when a new Notification has been added.
   * When the user clicks on a push notification, the app will launch and redirect to the NotificationsPage.
   * Push notifications are not sent if the user's NotifPrefs have them disabled.
   * @param notif The Notification whose contents will be displayed in the push notification.
   */
  private async sendPushNotification(notif: Notification) {
    if(GlobalServices.notifsPrefsService.prefs.enablePushNotifs && await this.localNotifs.hasPermission()) {
      this.localNotifs.schedule({
        title: notif.title,
        text: notif.summary,
        launch: true,
        autoClear: true,
        sticky: false,
        smallIcon: "file://assets/icon"
      });
    }

    const subscription = new Subscription();

    subscription.add(this.localNotifs.on("click").subscribe(() => {
      this.navController.navigateRoot("/main/tabs/notifications-tab").then(() => {
        subscription.unsubscribe();
      });
    }));
  }

  /**
   * Vibrates the user's device when a new Notification has been added.
   * The device will not vibrate if the user's NotifPrefs has vibration disabled.
   */
  private vibrateDevice() {
    if(GlobalServices.notifsPrefsService.prefs.enableVibration) {
      this.vibration.vibrate([100, 50, 100]);
    }
  }

  /**
   * Call a function when this NotifsGeneratorService adds a new Notification.
   * @param callback The function to call.
   */
  public static subscribeOnNotifGenerated(callback: Function) {
    this.onGeneratedCallbacks.push(callback);
  }
}