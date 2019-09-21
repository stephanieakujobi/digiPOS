/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { NotificationIcon } from './NotificationIcon';
import { NotificationSeverity as NotificationSeverity } from './NotificationSeverity';

/**
 * AppNotifications hold the information about notifications that users can receive and interact with on the Notification's tab page of the app.
 */
export class AppNotification {
    private _title: string;
    private _summary: string;
    private _severity: NotificationSeverity;
    private _dateReceived: Date;
    private _isRead: boolean;
    private _icon: NotificationIcon;

    /**
     * Creates a new AppNotification.
     * @param title The title of this AppNotification.
     * @param summary The text detailing what this AppNotification is about to the user.
     * @param severity The optional NotificationSeverity of this AppNotification. If unset, "Information" will be the default. 
     * @param dateReceived The optional custom Date this AppNotification has been received by the user. If unset, today's date will be used.
     */
    public constructor(title: string, summary: string, severity: NotificationSeverity = NotificationSeverity.Information, dateReceived: Date = new Date()) {
        this._title = title;
        this._summary = summary;
        this._severity = severity;
        this._dateReceived = dateReceived;
        this._isRead = false;
        this._icon = new NotificationIcon(severity);
    }

    /**
     * @returns This AppNotification's dateReceived value as a string in "dow-mm-dd-yyyy" format.
     */
    public get dateAsString(): string {
        return this.dateReceived.toDateString();
    }

    /**
     * @returns The title of this AppNotification.
     */
    public get title(): string {
        return this._title;
    }

    /**
    * @returns The summary of this AppNotification.
    */
    public get summary(): string {
        return this._summary;
    }

    /**
     * @returns The severity of this AppNotification.
     */
    public get severity(): NotificationSeverity {
        return this._severity;
    }

    /**
     * @returns The Date this AppNotification has been received by the user.
     */
    public get dateReceived(): Date {
        return this._dateReceived;
    }

    /**
    * Whether or not this AppNotification has been read by the user.
    */
    public get isRead(): boolean {
        return this._isRead;
    }

    /**
     * @param value If true, marks this AppNotification as "read", else "unread".
     */
    public set isRead(value: boolean) {
        this._isRead = value;
    }

    /**
     * @returns The icon of this AppNotification, represented by its severity value.
     */
    public get icon(): NotificationIcon {
        return this._icon;
    }
}