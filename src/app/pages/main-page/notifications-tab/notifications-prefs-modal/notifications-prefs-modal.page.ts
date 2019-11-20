import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotifsPrefs } from 'src/app/classes/notifications/NotifsPrefs';
import { NotifsPrefsService } from 'src/app/services/notifications/preferences/notifs-prefs.service';
import { PopupsService } from 'src/app/services/global/popups.service';
import { PrefsModal } from 'src/app/classes/global/PrefsModal';

/**
 * The NotifsPrefsModalPage is a modal page that contains the various options for users to configure for their Notifications.
 */
@Component({
  selector: 'app-notifications-prefs-modal',
  templateUrl: './notifications-prefs-modal.page.html',
  styleUrls: ['./notifications-prefs-modal.page.scss'],
})
export class NotifsPrefsModalPage extends PrefsModal<NotifsPrefs> {
  /**
   * Creates a new NotifsPrefsModalPage.
   * @param modalController The reference to the ModalController that created this modal.
   * @param prefsService The NotifsPrefsService used to update the user's preferences.
   * @param popupsService The PopupsService used to show toast messages to the user when updating preferences.
   */
  constructor(modalController: ModalController, prefsService: NotifsPrefsService, popupsService: PopupsService) {
    super(modalController, prefsService, popupsService);
  }
}