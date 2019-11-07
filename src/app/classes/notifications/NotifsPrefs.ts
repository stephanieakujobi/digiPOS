/**
 * The NotifsPrefs is a container class for holding the data for a user's notification settings.
 */
export class NotifsPrefs {
    public enableNotifs: boolean;
    public enablePushNotifs: boolean;
    public vibrateOnNotifReceived: boolean;
    public askBeforeDelete: boolean;

    /**
     * Creates a new NotifsPrefs instance.
     * All preferences are set to true by default.
     */
    public constructor() {
        this.enableNotifs = true;
        this.enablePushNotifs = true;
        this.vibrateOnNotifReceived = true;
        this.askBeforeDelete = true;
    }
}