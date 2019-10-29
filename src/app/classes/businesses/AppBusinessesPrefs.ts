/**
 * A model class containing the preferences that users can configure for the saved Businesses page.
 */
export class AppBusinessesPrefs {
    public askBeforeDelete: boolean;

    /**
     * Creates a new AppBusinessesPrefs instance.
     * All preferences are set to true by default.
     */
    public constructor() {
        this.askBeforeDelete = true;
    }
}