/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/29
*/

import { AppNotifIcon } from './AppNotifIcon';
import { AppNotifSeverity as AppNotifSeverity } from './AppNotifSeverity';
import { AppNotifDate } from './AppNotifDate';

/**
 * AppNotifications hold the information about notifications that users can receive and interact with on the Notification's tab page of the app.
 */
export class AppNotification {
    public title: string;
    public summary: string;
    public severity: AppNotifSeverity;
    public dateReceived: AppNotifDate;
    public isRead: boolean;
    public icon: AppNotifIcon;

    /**
     * Creates a new AppNotification.
     * @param title The title of this AppNotification.
     * @param summary The text detailing what this AppNotification is about to the user.
     * @param severity The optional AppNotifSeverity of this AppNotification. If unset, "Information" will be the default. 
     * @param dateReceived The optional custom Date this AppNotification has been received by the user. If unset, today's date will be used.
     */
    public constructor(title: string, summary: string, severity = AppNotifSeverity.Information, dateReceived = new Date()) {
        this.title = title;
        this.summary = summary;
        this.severity = severity;
        this.dateReceived = new AppNotifDate(dateReceived);
        this.isRead = false;
        this.icon = new AppNotifIcon(severity);
    }
}