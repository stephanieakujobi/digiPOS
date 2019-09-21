/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotificationSettings } from 'src/app/classes/notifications/NotificationSettings';

@Component({
  selector: 'app-notifications-settings',
  templateUrl: './notifications-settings.modal.html',
  styleUrls: ['./notifications-settings.modal.scss'],
})

/**
 * The NotificationsSettingsModal is a modal page that contains the various options for users to configure for their Notifications.
 */
export class NotificationsSettingsModal {
  /**
   * The NotificationSettings passed from the NotificationsTabPage when this modal is created.
   */
  public settings: NotificationSettings;

  /**
   * Creates a new NotificationsSettingsModal
   * @param modalController The reference to the ModalController that created this modal.
   */
  constructor(public modalController: ModalController) { }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Closes this modal page and returns back to the NotificationsTabPage with the updated NotificationSettings.
   */
  dismiss() {
    this.modalController.dismiss(this.settings);
  }
}