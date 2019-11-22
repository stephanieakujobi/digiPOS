import { ModalController } from '@ionic/angular';
import { PopupsService } from 'src/app/services/global/popups/popups.service';
import { PrefsService } from './PrefsService';

/**
 * The abstract class for all modals that deal with user preferences.
 * Provides the general preference updating and modal closing functionalities for inherited classes.
 * @param T The model object acting as the user preferences to read/write with.
 */
export abstract class PrefsModal<T> {
    protected prefs: T;

    /**
     * Creates a new PrefsModal.
     * @param modalController The ModalController used to dismiss this modal.
     * @param prefsService The PrefsService used to update the user preferences with the model object of type T.
     * @param popupsService The PopupsService used to display a toast message to the user when updating their preferences.
     */
    constructor(private modalController: ModalController, private prefsService: PrefsService<T>, private popupsService: PopupsService) {
        this.prefs = prefsService.prefs;
    }

    /**
     * Called from the page when the user clicks the "X" button on the navigation bar.
     * Closes this modal page and returns back to the page that created the modal.
     */
    async onCloseButtonClicked() {
        const prefsUpdated: boolean = await this.prefsService.savePrefs(this.prefs);
        this.popupsService.showToast(prefsUpdated ? "Preferences updated" : "Failed to update preferences - unknown error");
        this.modalController.dismiss();
    }
}
