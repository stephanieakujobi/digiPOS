import { NativeStorage } from '@ionic-native/native-storage/ngx';

/**
 * An abstract class that provides the universal saving/loading application preferences funcions.
 * @param T The object serving as the model for user preferences that will be saved and loaded.
 */
export abstract class PrefsService<T> {
    private readonly storageKey: string
    private _prefs: T;

    /**
     * Creates a new PrefsService instance.
     * @param nativeStorage The NativeStorage used to save and load Google Maps preferences.
     */
    constructor(private nativeStorage: NativeStorage) {
        this.storageKey = this.setStorageKey();
    }

    /**
     * A function called when constructed.
     * Inherited classes should set the storage key name of the preferences they wish to read/write with.
     */
    protected abstract setStorageKey(): string;

    /**
     * Loads the user's preferences.
     * If there are no pre-existing preferences, a new T object will be created and saved as the user's preferences instead.
     * @returns The user's preferences represented in the type of T.
     */
    public async loadPrefs() {
        let prefsResult: T;

        await this.nativeStorage.getItem(this.storageKey).then(
            savedPrefs => {
                prefsResult = savedPrefs;
            },
            error => {
                if(error.exception == null) {
                    prefsResult = this.instantiateNewPrefs();
                }
            }
        );

        this._prefs = prefsResult;
    }

    /**
     * Updates the user's preferences.
     * @param prefs The new set of preferences to save.
     * @returns A true or false result representing if the save was successful or not respectively.
     */
    public async savePrefs(prefs: T): Promise<boolean> {
        let didSucceed: boolean = false;

        await this.nativeStorage.setItem(this.storageKey, prefs)
            .then(() => {
                didSucceed = true;
                this._prefs = prefs;
            });

        return didSucceed;
    }

    /**
     * This function is called when no existing preferences could be found on the user's device.
     * Inherited classes should return a new object of type T.
     */
    protected abstract instantiateNewPrefs(): T;

    /**
     * The user's current preferences.
     */
    public get prefs(): T {
        return this._prefs;
    }
}
