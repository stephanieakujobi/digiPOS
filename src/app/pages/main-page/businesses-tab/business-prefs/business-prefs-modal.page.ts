import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AppBusinessesPrefs } from 'src/app/classes/businesses/AppBusinessesPrefs';
import { AppBusinessesPrefsService } from 'src/app/services/businesses/preferences/app-businesses-prefs.service';

@Component({
  selector: 'app-business-prefs-modal',
  templateUrl: './business-prefs-modal.page.html',
  styleUrls: ['./business-prefs-modal.page.scss'],
})

/**
 * The modal page opened when the user presses the settings icon on the top-right of the BusinessesPage.
 * Displays the user's current saved Businesses preferences, allowing them to be rewritten.
 */
export class BusinessPrefsModalPage {
  private prefs: AppBusinessesPrefs;

  /**
   * Creates a new BusinessPrefsModalPage
   * @param modalController The ModalController used to dismis this modal.
   */
  constructor(private modalController: ModalController) {
    this.prefs = AppBusinessesPrefsService.prefs;
  }

  /**
   * Called from the page when the user clicks on the "X" button on the top-right of the modal.
   * Dismisses this modal and returns the user's updated AppBusinessesPrefs.
   */
  onCloseButtonClicked() {
    this.modalController.dismiss(this.prefs);
  }
}