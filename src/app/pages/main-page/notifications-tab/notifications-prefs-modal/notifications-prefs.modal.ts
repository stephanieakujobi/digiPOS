import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AppNotifsPrefs } from 'src/app/models/notifications/AppNotifsPrefs';
import { AppNotifsPrefsService } from 'src/app/services/notifications/preferences/app-notifs-prefs.service';

@Component({
  selector: 'app-notifications-prefs',
  templateUrl: './notifications-prefs.modal.html',
  styleUrls: ['./notifications-prefs.modal.scss'],
})

/**
 * The NotificationsSettingsModal is a modal page that contains the various options for users to configure for their Notifications.
 */
export class NotificationsPrefsModal {
  private prefs: AppNotifsPrefs;

  /**
   * Creates a new NotificationsSettingsModal
   * @param modalController The reference to the ModalController that created this modal.
   * @param navParams The NavParams used to check for existing AppNotifPrefs to display.
   */
  constructor(private modalController: ModalController, navParams: NavParams) {
    let existingPrefs = navParams.get("prefs") as AppNotifsPrefs;
    this.prefs = existingPrefs != null? existingPrefs : new AppNotifsPrefs();
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Closes this modal page and returns back to the NotificationsTabPage.
   */
  onCloseButtonClicked() {
    this.modalController.dismiss(this.prefs);
  }
}