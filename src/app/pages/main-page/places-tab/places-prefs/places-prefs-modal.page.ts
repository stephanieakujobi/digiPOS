import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PlacesPrefs } from 'src/app/classes/places/PlacesPrefs';
import { PlacesPrefsService } from 'src/app/services/places/preferences/places-prefs.service';
import { PopupsService } from 'src/app/services/global/popups.service';
import { PrefsModal } from 'src/app/classes/global/PrefsModal';

/**
 * The modal page opened when the user presses the settings icon on the top-right of the BusinessesPage.
 * Displays the user's current saved Businesses preferences, allowing them to be rewritten.
 */
@Component({
  selector: 'app-places-prefs-modal',
  templateUrl: './places-prefs-modal.page.html',
  styleUrls: ['./places-prefs-modal.page.scss'],
})
export class PlacesPrefsModalPage extends PrefsModal<PlacesPrefs> {
  /**
   * Creates a new PlacesPrefsModalPage.
   * @param modalController The reference to the ModalController that created this modal.
   * @param prefsService The PlacesPrefsService used to update the user's preferences.
   * @param popupsService The PopupsService used to show toast messages to the user when updating preferences.
   */
  constructor(modalController: ModalController, prefsService: PlacesPrefsService, popupsService: PopupsService) {
    super(modalController, prefsService, popupsService);
  }
}