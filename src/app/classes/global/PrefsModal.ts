import { ModalController } from '@ionic/angular';
import { PopupsService } from 'src/app/services/global/popups.service';
import { PrefsService } from './PrefsService';
export abstract class PrefsModal<T> {
    protected prefs: T;

    constructor(private modalController: ModalController, private prefsService: PrefsService<T>, private popupsService: PopupsService) {
        this.prefs = prefsService.prefs;
    }

    /**
     * Called from the page when the user clicks the "X" button on the navigation bar.
     * Closes this modal page and returns back to the HomeTabPage.
     */
    async onCloseButtonClicked() {
        const prefsUpdated: boolean = await this.prefsService.savePrefs(this.prefs);
        this.popupsService.showToast(prefsUpdated ? "Preferences updated" : "Failed to update preferences - unknown error");
        this.modalController.dismiss();
    }
}
