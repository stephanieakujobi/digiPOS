/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

/**
 * The NotificationSettings is a container class for holding the data for a user's notification settings.
 */
export class NotificationSettings {
    private _enableNotifs: boolean;
    private _enablePushNotifs: boolean;
    private _vibrateOnNotifReceived: boolean;
    private _askBeforeDeleteNotif: boolean;

    /**
     * Creates a new NotificationSettings instance.
     * All settings are set to true by default.
     */
    public constructor() {
        this._enableNotifs = true;
        this._enablePushNotifs = true;
        this._vibrateOnNotifReceived = true;
        this._askBeforeDeleteNotif = true;
    }

    /**
     * @returns a true or false value.
     */
    public get enableNotifs(): boolean {
        return this._enableNotifs;
    }

    /**
     * Whether or not notifications are enabled. 
     */
    public set enableNotifs(value: boolean) {
        this._enableNotifs = value;
    }

    /**
     * @returns a true or false value.
     */
    public get enablePushNotifs(): boolean {
        return this._enablePushNotifs;
    }

    /**
     * Whether or not push notifications are enabled. 
     */
    public set enablePushNotifs(value: boolean) {
        this._enablePushNotifs = value;
    }

    /**
     * @returns a true or false value.
     */
    public get vibrateOnNotifReceived(): boolean {
        return this._vibrateOnNotifReceived;
    }

    /**
     * Whether or not the user's device should vibrate when they receive an AppNotification. 
     */
    public set vibrateOnNotifReceived(value: boolean) {
        this._vibrateOnNotifReceived = value;
    }

    /**
     * @returns a true or false value.
     */
    public get askBeforeDeleteNotif(): boolean {
        return this._askBeforeDeleteNotif;
    }

    /**
     * Whether or not the user should be prompted for confirmation before deleting an AppNotification.
     */
    public set askBeforeDeleteNotif(value: boolean) {
        this._askBeforeDeleteNotif = value;
    }
}