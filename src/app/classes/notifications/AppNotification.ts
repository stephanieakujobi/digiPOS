/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/29
*/

import { NotificationIcon } from './NotificationIcon';
import { NotificationSeverity as NotificationSeverity } from './NotificationSeverity';
import { NotificationDate } from './NotificationDate';

/**
 * AppNotifications hold the information about notifications that users can receive and interact with on the Notification's tab page of the app.
 */
export class AppNotification {
    public title: string;
    public summary: string;
    public severity: NotificationSeverity;
    public dateReceived: NotificationDate;
    public isRead: boolean;
    public icon: NotificationIcon;

    /**
     * Creates a new AppNotification.
     * @param title The title of this AppNotification.
     * @param summary The text detailing what this AppNotification is about to the user.
     * @param severity The optional NotificationSeverity of this AppNotification. If unset, "Information" will be the default. 
     * @param dateReceived The optional custom Date this AppNotification has been received by the user. If unset, today's date will be used.
     */
    public constructor(title: string, summary: string, severity: NotificationSeverity = NotificationSeverity.Information, dateReceived: Date = new Date()) {
        this.title = title;
        this.summary = summary;
        this.severity = severity;
        this.dateReceived = new NotificationDate(dateReceived);
        this.isRead = false;
        this.icon = new NotificationIcon(severity);
    }
}