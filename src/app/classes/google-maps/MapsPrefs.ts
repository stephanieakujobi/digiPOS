/**
 * A model class containing the preferences that users can configure for Google Maps usage.
 */
export class MapsPrefs {
    public showSavedPlaces: boolean;
    public showSavedReportedPlaces: boolean;
    public showOtherReportedPlaces: boolean;
    public searchRadiusKm: number;
    public prefMapsApp: string;

    /**
     * Creates a new MapsPrefs instance with default settings.
     */
    public constructor(defaultMapsApp: string) {
        this.showSavedPlaces = true;
        this.showSavedReportedPlaces = true;
        this.showOtherReportedPlaces = true;
        this.searchRadiusKm = 50;
        this.prefMapsApp = defaultMapsApp;
    }
}