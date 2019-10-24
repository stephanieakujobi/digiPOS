import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AppBusinessesPrefs } from 'src/app/classes/businesses/AppBusinessesPrefs';
import { AppBusinessesPrefsService } from 'src/app/services/businesses/preferences/app-businesses-prefs.service';

@Component({
  selector: 'app-business-prefs-modal',
  templateUrl: './business-prefs-modal.page.html',
  styleUrls: ['./business-prefs-modal.page.scss'],
})
export class BusinessPrefsModalPage {
  private prefs: AppBusinessesPrefs;

  constructor(private modalController: ModalController, navParams: NavParams) {
    let existingPrefs = navParams.get("prefs") as AppBusinessesPrefs;
    this.prefs = existingPrefs != null? existingPrefs : new AppBusinessesPrefs();
  }

  onCloseButtonClicked() {
    this.modalController.dismiss(this.prefs);
  }
}