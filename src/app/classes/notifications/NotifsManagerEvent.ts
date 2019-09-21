/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

/**
 * The NotifsManagerEvents is a set of events that the NotificationsManager can publish.
 * Events can be subscribed to and unsubscribed from in the NotificationsManager class.
 */
export enum NotifsManagerEvents {
    /**
     * This event is published whenever the NotificationsManager adds a new AppNotification.
     */
    OnNotifAdded = "onNotifAdded",

    /**
     * This event is published whenever the NotificationsManager deletes an AppNotification.
     */
    OnNotifDeleted = "onNotifDeleted"
}
