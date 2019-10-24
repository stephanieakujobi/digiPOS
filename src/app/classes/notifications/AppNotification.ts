import { AppNotifIcon } from './AppNotifIcon';
import { AppNotifSeverity as AppNotifSeverity } from './AppNotifSeverity';
import { AppNotifDate } from './AppNotifDate';

/**
 * AppNotifications hold the information about notifications that users can receive and interact with on the Notification's tab page of the app.
 */
export class AppNotification {
    private _title: string;
    private _summary: string;
    private _severity: AppNotifSeverity;
    private _dateReceived: AppNotifDate;
    private _icon: AppNotifIcon;
    private _isRead: boolean;

    /**
     * Creates a new AppNotification.
     * @param title The title of this AppNotification.
     * @param summary The text detailing what this AppNotification is about to the user.
     * @param severity The optional AppNotifSeverity of this AppNotification. If unset, "Information" will be the default. 
     * @param dateReceived The optional custom Date this AppNotification has been received by the user. If unset, today's date will be used.
     */
    public constructor(title: string, summary: string, severity = AppNotifSeverity.Information, dateReceived = new Date()) {
        this._title = title;
        this._summary = summary;
        this._severity = severity;
        this._dateReceived = new AppNotifDate(dateReceived);
        this._icon = new AppNotifIcon(severity);
        this._isRead = false;
    }

    public get title(): string {
        return this._title;
    }

    public get summary(): string {
        return this._summary;
    }

    public get severity(): AppNotifSeverity {
        return this._severity;
    }

    public get dateReceived(): AppNotifDate {
        return this._dateReceived;
    }

    public get icon(): AppNotifIcon {
        return this._icon;
    }

    public get isRead(): boolean {
        return this._isRead;
    }

    public set isRead(value: boolean) {
        this._isRead = value;
    }
}