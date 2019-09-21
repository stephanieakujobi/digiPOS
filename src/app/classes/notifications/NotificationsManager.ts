/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { AppNotification } from './AppNotification';
import { Events } from '@ionic/angular';
import { EventHandler } from '@ionic/angular/dist/providers/events';
import { NotifsManagerEvents as NotifsManagerEvent } from './NotifsManagerEvent';

/**
 * The NotificationsManager manages all AppNotifications received by the user and provides utility functions to add, sort, and delete AppNotifications.
 * Instances of NotificationsManager cannot be created, and it should instead be treated as a static class.
 */
export class NotificationsManager {
    private static _notifications: AppNotification[] = [];
    private static events: Events = new Events();

    /**
     * A private constructor prevents NotificationsManager from being instantiated by external classes.
     */
    private constructor() { }

    /**
     * Adds a new AppNotification to the NotificationsManager's collection.
     * @param notification The AppNotification to add.
     */
    public static addNotification(notification: AppNotification) {
        this.notifications.push(notification);
        this.events.publish(NotifsManagerEvent.OnNotifAdded, notification);
        this.updateNotifsDB();
    }

    /**
     * Deletes an AppNotification from the NotificationsManager's collection.
     * @param notification The AppNotification to delete.
     */
    public static deleteNotification(notification: AppNotification) {
        this._notifications.splice(this._notifications.indexOf(notification), 1);
        this.events.publish(NotifsManagerEvent.OnNotifDeleted, notification);
        this.updateNotifsDB();
    }

    /**
     * Marks an AppNotification as "read" or "unread" by the value of the "isRead" parameter.
     * @param notif The AppNotification to mark.
     * @param isRead Marks the AppNotification as "read" if true, or "unread" if false.
     */
    public static markNotifRead(notif: AppNotification, isRead: boolean) {
        notif.isRead = isRead;
        this.updateNotifsDB();
    }

    /**
     * Updates the database reference of AppNotifications on a device's native storage environment.
     * @todo https://ionicframework.com/docs/building/storage.
     */
    private static updateNotifsDB() {
        //localStorage["notifications"] = JSON.stringify(this.notifications);
    }

    /**
     * The array of AppNotifications managed by this NotificationsManager.
     */
    public static get notifications(): AppNotification[] {
        return this._notifications;
    }

    /**
     * Assign event handlers whenever this NotificationsManager publishes the specified NotifsManagerEvent parameter.
     * @param event The NotifsManagerEvent to listen for. 
     * @param handlers The callback handlers to subscribe to the event.
     */
    public static subscribeTo(event: NotifsManagerEvent, ...handlers: EventHandler[]) {
        handlers.forEach(handler => {
            this.events.subscribe(event, handler);
        });
    }

    /**
     * Unassign event handlers whenever from the specified NotifsManagerEvent parameter.
     * @param event The NotifsManagerEvent to unsubscribe from. 
     * @param handlers The callback handlers that will be unsubscribed.
     */
    public static unsubscribeFrom(event: NotifsManagerEvent, ...handlers: EventHandler[]) {
        handlers.forEach(handler => {
            this.events.unsubscribe(event, handler);
        });
    }
}