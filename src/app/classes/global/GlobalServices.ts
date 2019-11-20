import { MapsPrefsService } from 'src/app/services/google-maps/preferences/maps-prefs.service'
import { PlacesPrefsService } from 'src/app/services/places/preferences/places-prefs.service'
import { NotifsPrefsService } from 'src/app/services/notifications/preferences/notifs-prefs.service'
import { NotifsStorageService } from 'src/app/services/notifications/storage/notifis-storage.service'

export class GlobalServices {
    private static _mapsPrefsService: MapsPrefsService;
    private static _placesPrefsService: PlacesPrefsService;
    private static _notifsPrefsService: NotifsPrefsService;
    private static _notifsStorageService: NotifsStorageService;

    private constructor() { }

    /**
     * Stores global static references to the provided services.
     * @param mapsPrefsService The MapsPrefsService used to load the user's saved Google Maps preferences.
     * @param placesPrefsService The PlacesPrefsService used to load the user's saved Places preferences.
     * @param notifsPrefsService The NotifsPrefsService used to load the user's saved Notifications preferences.
     * @param notifsStorage The NotifsStorageService used to load the user's saved Notifications on their device.
     */
    public static initialize(
        mapsPrefsService: MapsPrefsService,
        placesPrefsService: PlacesPrefsService,
        notifsPrefsService: NotifsPrefsService,
        notifsStorageService: NotifsStorageService
    ) {
        GlobalServices._mapsPrefsService = mapsPrefsService;
        GlobalServices._placesPrefsService = placesPrefsService;
        GlobalServices._notifsPrefsService = notifsPrefsService;
        GlobalServices._notifsStorageService = notifsStorageService;
    }

    /**
     * Asynchronously loads all of the user's various preferences and saved data on their device.
     */
    public static async loadUserData() {
        await this.mapsPrefsService.loadPrefs();
        await this.placesPrefsService.loadPrefs();
        await this.notifsPrefsService.loadPrefs();
        await this.notifsStorageService.loadNotifs();
    }

    public static get mapsPrefsService(): MapsPrefsService {
        return this._mapsPrefsService;
    }

    public static get placesPrefsService(): PlacesPrefsService {
        return this._placesPrefsService;
    }

    public static get notifsPrefsService(): NotifsPrefsService {
        return this._notifsPrefsService;
    }

    public static get notifsStorageService(): NotifsStorageService {
        return this._notifsStorageService;
    }
}