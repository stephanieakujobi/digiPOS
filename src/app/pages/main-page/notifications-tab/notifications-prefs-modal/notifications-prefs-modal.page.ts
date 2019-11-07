import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotifsPrefs } from 'src/app/classes/notifications/NotifsPrefs';
import { NotifsPrefsService } from 'src/app/services/notifications/preferences/notifs-prefs.service';

@Component({
  selector: 'app-notifications-prefs-modal',
  templateUrl: './notifications-prefs-modal.page.html',
  styleUrls: ['./notifications-prefs-modal.page.scss'],
})

/**
 * The NotifsPrefsModalPage is a modal page that contains the various options for users to configure for their Notifications.
 */
export class NotifsPrefsModalPage {
  private prefs: NotifsPrefs;

  /**
   * Creates a new NotifsPrefsModalPage
   * @param modalController The reference to the ModalController that created this modal.
   */
  constructor(private modalController: ModalController) {
    this.prefs = NotifsPrefsService.prefs;
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Closes this modal page and returns back to the NotificationsTabPage.
   */
  onCloseButtonClicked() {
    this.modalController.dismiss(this.prefs);
  }
}