/**
 * A AppNotifSeverity categorizes AppNotifications into three levels of importance: "Information", "Alert", and "Error".
 * In combination with NotificationIcons, an AppNotification's severity will be represented by the type of icon displayed on the notifications tab page.
 */
export enum AppNotifSeverity {
    Information = "information",
    Alert = "alert",
    Error = "error"
}