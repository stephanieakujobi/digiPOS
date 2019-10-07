/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/10/01
*/

/**
 * The AppNotifPrefs is a container class for holding the data for a user's notification settings.
 */
export class AppNotifsPrefs {
    public enableNotifs: boolean;
    public enablePushNotifs: boolean;
    public vibrateOnNotifReceived: boolean;
    public askBeforeDeleteNotif: boolean;

    /**
     * Creates a new AppNotifPrefs instance.
     * All settings are set to true by default.
     */
    public constructor() {
        this.enableNotifs = true;
        this.enablePushNotifs = true;
        this.vibrateOnNotifReceived = true;
        this.askBeforeDeleteNotif = true;
    }
}