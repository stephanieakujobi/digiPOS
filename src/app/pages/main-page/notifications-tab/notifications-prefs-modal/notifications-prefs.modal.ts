/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/10/02
*/

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppNotifsPrefs } from 'src/app/classes/notifications/AppNotifsPrefs';
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
   */
  constructor(private modalController: ModalController) { 
    this.prefs = AppNotifsPrefsService.notifsPrefs;
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Closes this modal page and returns back to the NotificationsTabPage.
   */
  async dismiss() {
    this.modalController.dismiss(this.prefs);
  }
}