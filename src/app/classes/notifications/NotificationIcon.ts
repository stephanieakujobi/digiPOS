/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/29
*/

import { NotificationSeverity } from './NotificationSeverity';

/**
 * A NotificationIcon is the icon that is displayed on the left of AppNotifications when viewed in the notifications tab page.
 * The icon's appearance depends on how severe the AppNotification is.
 */
export class NotificationIcon {
    public name: string;
    public color: string;

    /**
     * Creates a new NotificationIcon.
     * @param iconType The type of icon to display represented by a NotificationSeverity value.
     *                 "Information" will display a blue "i", "Alert" will display a yellow "!", and "Error" will display a red "X".
     */
    public constructor(iconType: NotificationSeverity) {
        if(iconType == NotificationSeverity.Information) {
            this.name = "information-circle";
            this.color = "primary"
        }
        else if(iconType == NotificationSeverity.Alert) {
            this.name = "alert";
            this.color = "warning"
        }
        else {
            this.name = "close-circle";
            this.color = "danger"
        }
    }
}