/**
 * An implementation for objects that act as a service for storing user preferences.
 * @param T The type of object acting as the preferences model that will be be saved/loaded.
 */
interface IAppPrefsService<T> {
    /**
     * Loads the user's preferences from storage.
     * @returns A Promise type containing the preferences model object from storage.
     */
    loadPrefs(): Promise<T>;

    /**
     * Saves the user's preference to storage (overwrites existing preferences).
     * @param prefs The preferences to save.
     */
    savePrefs(prefs: T): Promise<boolean>;
}