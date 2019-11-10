import { Injectable } from '@angular/core';
import { NotifsStorageService } from '../storage/notifis-storage.service';
import { NotifsPrefsService } from '../preferences/notifs-prefs.service';
import { NotifProcess } from 'src/app/classes/notifications/NotifProcess';
import { Notification } from 'src/app/classes/notifications/Notification';
import { FirebasePlacesService } from '../../firebase/places/firebase-places.service';

@Injectable({
  providedIn: 'root'
})
export class NotifsGeneratorService {
  private processes: NotifProcess[];
  private onGeneratedCallbacls: Function[];

  constructor(private storageService: NotifsStorageService, private prefsService: NotifsPrefsService, private fbpService: FirebasePlacesService) {
    this.processes = [];
    this.onGeneratedCallbacls = [];

    this.placesNotUpdatedOverTime();
    prefsService.subscribeOnUpdated(() => this.watchProcesses());
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

      for(const place of this.fbpService.savedPlaces) {
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
    this.onGeneratedCallbacls.push(callback);
  }

  private async addNotification(notif: Notification) {
    if(NotifsPrefsService.prefs.enableNotifs && !this.storageService.hasNotif(notif)) {
      const addSuccess = await this.storageService.addNotif(notif);

      if(addSuccess) {
        this.onGeneratedCallbacls.forEach(c => c());
      }
    }
  }
}