import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotifsPrefs } from 'src/app/classes/notifications/NotifsPrefs';
import { PopupsService } from 'src/app/services/global/popups/popups.service';
import { PrefsModal } from 'src/app/classes/global/PrefsModal';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';

/**
 * The modal page opened when the user presses the settings icon on the top-right of the NotificationsTabPage.
 * Displays the user's current saved NotifsPrefs, allowing them to be rewritten.
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
   * @param popupsService The PopupsService used to show toast messages to the user when updating preferences.
   */
  constructor(modalController: ModalController, popupsService: PopupsService) {
    super(modalController, GlobalServices.notifsPrefsService, popupsService);
  }
}