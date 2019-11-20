/**
 * A model class containing the preferences that users can configure for Google Maps usage.
 */
export class MapsPrefs {
    public showUserSavedPlaces: boolean;
    public showUserReportedPlaces: boolean;
    public showOtherReportedPlaces: boolean;
    public searchRadiusKm: number

    /**
     * Creates a new MapsPrefs instance with default settings.
     */
    public constructor() {
        this.showUserSavedPlaces = true;
        this.showUserReportedPlaces = true;
        this.showOtherReportedPlaces = true;
        this.searchRadiusKm = 50;
    }
}