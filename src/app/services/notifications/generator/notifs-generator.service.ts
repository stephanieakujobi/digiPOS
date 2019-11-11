import { Injectable } from '@angular/core';
import { NotifsStorageService } from '../storage/notifis-storage.service';
import { NotifsPrefsService } from '../preferences/notifs-prefs.service';
import { NotifProcess } from 'src/app/classes/notifications/NotifProcess';
import { Notification } from 'src/app/classes/notifications/Notification';
import { FirebasePlacesService } from '../../firebase/places/firebase-places.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Push, PushObject } from '@ionic-native/push/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotifsGeneratorService {
  private processes: NotifProcess[];
  private onGeneratedCallbacks: Function[];

  private pushPermissionEnabled: boolean;

  constructor(
    private storageService: NotifsStorageService,
    private prefsService: NotifsPrefsService,
    private fbpService: FirebasePlacesService,
    private vibration: Vibration,
    private push: Push
  ) {
    this.processes = [];
    this.onGeneratedCallbacks = [];

    this.checkPushPermissionEnabled();
    this.placesNotUpdatedOverTime();
    prefsService.subscribeOnUpdated(() => this.watchProcesses());
  }

  private async checkPushPermissionEnabled() {
    const permission = await this.push.hasPermission();
    this.pushPermissionEnabled = permission.isEnabled;
  }

  public watchProcesses() {
    if(NotifsPrefsService.prefs.enableNotifs) {
      this.processes.forEach(p => p.start());
    }
    else {
      this.processes.forEach(p => p.stop());
    }
  }

  private placesNotUpdatedOverTime() {
    const process = new NotifProcess(() => {

      for(const place of this.fbpService.savedPlaces.filter(p => !p.isReported)) {
        const daysSinceUpdate = Math.floor((new Date(place.dateUpdated).getTime() - new Date(place.dateSaved).getTime()) / 8.64e+7);

        if(daysSinceUpdate > 6) {
          const notif = new Notification(
            `Reminder to visit ${place.info.name}`,
            `It has been ${daysSinceUpdate} days since you have last updated ${place.info.name}. Why not pay them a visit?`,
            "info",
          );

          this.addNotification(notif);
        }
      }

    });

    this.processes.push(process);
  }

  public subscribeOnNotifGenerated(callback: Function) {
    this.onGeneratedCallbacks.push(callback);
  }

  private async addNotification(notif: Notification) {
    if(NotifsPrefsService.prefs.enableNotifs && !this.storageService.hasNotif(notif)) {
      const addSuccess = await this.storageService.addNotif(notif);

      if(addSuccess) {
        this.notifGeneratedPush();
        this.notifGeneratedVibrate();
        this.onGeneratedCallbacks.forEach(c => c());
      }
    }
  }

  private notifGeneratedPush() {
    if(this.pushPermissionEnabled && NotifsPrefsService.prefs.enablePushNotifs) {
      this.push.createChannel({
        id: "testchannel1",
        description: "The test channel.",
        importance: 3
      });

      const pushObject: PushObject = this.push.init({
        ios: {
          alert: true,
          badge: true,
          sound: false
        }
      });

      pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

      pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }
  }

  private notifGeneratedVibrate() {
    if(NotifsPrefsService.prefs.vibrateOnNotifReceived) {
      this.vibration.vibrate([800, 600, 800]);
    }
  }
}