import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PlacesPrefs } from 'src/app/classes/places/PlacesPrefs';
import { PlacesPrefsService } from 'src/app/services/places/preferences/places-prefs.service';

@Component({
  selector: 'app-places-prefs-modal',
  templateUrl: './places-prefs-modal.page.html',
  styleUrls: ['./places-prefs-modal.page.scss'],
})

/**
 * The modal page opened when the user presses the settings icon on the top-right of the BusinessesPage.
 * Displays the user's current saved Businesses preferences, allowing them to be rewritten.
 */
export class PlacesPrefsModalPage {
  private prefs: PlacesPrefs;

  /**
   * Creates a new BusinessPrefsModalPage
   * @param modalController The ModalController used to dismis this modal.
   */
  constructor(private modalController: ModalController) {
    this.prefs = PlacesPrefsService.prefs;
  }

  /**
   * Called from the page when the user clicks on the "X" button on the top-right of the modal.
   * Dismisses this modal and returns the user's updated AppBusinessesPrefs.
   */
  onCloseButtonClicked() {
    this.modalController.dismiss(this.prefs);
  }
}