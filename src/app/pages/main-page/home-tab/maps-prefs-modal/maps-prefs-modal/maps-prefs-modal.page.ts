import { Component } from '@angular/core';
import { MapsPrefs } from 'src/app/classes/google-maps/MapsPrefs';
import { MapsPrefsService } from 'src/app/services/google-maps/preferences/maps-prefs.service';
import { ModalController } from '@ionic/angular';
import { PopupsService } from 'src/app/services/global/popups.service';

@Component({
  selector: 'app-maps-prefs-modal',
  templateUrl: './maps-prefs-modal.page.html',
  styleUrls: ['./maps-prefs-modal.page.scss'],
})
export class MapsPrefsModalPage {
  private prefs: MapsPrefs;

  /**
   * Creates a new MapsPrefsModalPage
   * @param modalController The reference to the ModalController that created this modal.
   */
  constructor(private modalController: ModalController, private prefsService: MapsPrefsService, private popupsService: PopupsService) {
    this.prefs = MapsPrefsService.prefs;
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Closes this modal page and returns back to the HomeTabPage.
   */
  async onCloseButtonClicked() {
    const prefsUpdated = this.prefsService.savePrefs(this.prefs);
    this.popupsService.showToast(prefsUpdated ? "Preferences updated." : "Failed to update preferences - unknown error.");
    this.modalController.dismiss();
  }
}
