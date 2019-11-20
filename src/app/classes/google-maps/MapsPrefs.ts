/**
 * A model class containing the preferences that users can configure for Google Maps usage.
 */
export class MapsPrefs {
    public showMySavedPlaces: boolean;
    public showMyReportedPlaces: boolean;
    public showAllReportedPlaces: boolean;
    public searchRadiusKm: number

    /**
     * Creates a new MapsPrefs instance with default settings.
     */
    public constructor() {
        this.showMySavedPlaces = true;
        this.showMyReportedPlaces = true;
        this.showAllReportedPlaces = true;
        this.searchRadiusKm = 100;
    }
}