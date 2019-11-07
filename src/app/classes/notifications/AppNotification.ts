import { NotifIcon } from './NotifIcon';
import { NotifSeverity } from './NotifSeverity';
import { NotifDate } from './NotifDate';

/**
 * AppNotifications hold the information about notifications that users can receive and interact with on the Notifications tab page of the app.
 */
export class AppNotification {
    private _title: string;
    private _summary: string;
    private _severity: NotifSeverity;
    private _dateReceived: NotifDate;
    private _icon: NotifIcon;
    private _isRead: boolean;

    /**
     * Creates a new AppNotification.
     * @param title The title of this AppNotification.
     * @param summary The text detailing what this AppNotification is about to the user.
     * @param severity The optional NotifSeverity of this AppNotification. If unset, "Information" will be the default. 
     * @param dateReceived The optional custom Date this AppNotification has been received by the user. If unset, today's date will be used.
     */
    public constructor(title: string, summary: string, severity: NotifSeverity = "info", dateReceived = new Date()) {
        this._title = title;
        this._summary = summary;
        this._severity = severity;
        this._dateReceived = new NotifDate(dateReceived);
        this._icon = new NotifIcon(severity);
        this._isRead = false;
    }

    /**
     * The title of this AppNotification.
     */
    public get title(): string {
        return this._title;
    }

    /**
     * The summary of this AppNotification.
     */
    public get summary(): string {
        return this._summary;
    }

    /**
     * The severity-level of this AppNotification.
     */
    public get severity(): NotifSeverity {
        return this._severity;
    }

    /**
     * The date this AppNotification was received by the user.
     */
    public get dateReceived(): NotifDate {
        return this._dateReceived;
    }

    /**
     * The icon of this AppNotification.
     */
    public get icon(): NotifIcon {
        return this._icon;
    }

    /**
     * Whether or not this AppNotification has been read by the user.
     */
    public get isRead(): boolean {
        return this._isRead;
    }
    public set isRead(value: boolean) {
        this._isRead = value;
    }
}