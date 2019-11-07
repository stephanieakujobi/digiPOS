/**
 * A model class containing the preferences that users can configure for the saved Places page.
 */
export class PlacesPrefs {
    public askBeforeDelete: boolean;

    /**
     * Creates a new PlacesPrefs instance.
     * All preferences are set to true by default.
     */
    public constructor() {
        this.askBeforeDelete = true;
    }
}