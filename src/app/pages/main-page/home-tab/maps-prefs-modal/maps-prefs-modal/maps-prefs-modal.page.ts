import { Component } from '@angular/core';
import { MapsPrefs } from 'src/app/classes/google-maps/MapsPrefs';
import { MapsPrefsService } from 'src/app/services/google-maps/preferences/maps-prefs.service';
import { ModalController } from '@ionic/angular';
import { PopupsService } from 'src/app/services/global/popups/popups.service';
import { PrefsModal } from 'src/app/classes/global/PrefsModal';
import { LaunchNavService } from 'src/app/services/global/launch-nav/launch-nav.service';

@Component({
  selector: 'app-maps-prefs-modal',
  templateUrl: './maps-prefs-modal.page.html',
  styleUrls: ['./maps-prefs-modal.page.scss'],
})
export class MapsPrefsModalPage extends PrefsModal<MapsPrefs> {
  /**
  * Creates a new MapsPrefsModalPage.
  * @param modalController The reference to the ModalController that created this modal.
  * @param prefsService The MapsPrefsService used to update the user's preferences.
  * @param popupsService The PopupsService used to show toast messages to the user when updating preferences.
  */
  constructor(modalController: ModalController, prefsService: MapsPrefsService, popupsService: PopupsService, private launchNavService: LaunchNavService) {
    super(modalController, prefsService, popupsService);
    console.log(this.prefs);
  }
}