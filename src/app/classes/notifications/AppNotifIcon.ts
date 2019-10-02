/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/10/01
*/

import { AppNotifSeverity } from './AppNotifSeverity';

/**
 * A AppNotifIcon is the icon that is displayed on the left of AppNotifications when viewed in the notifications tab page.
 * The icon's appearance depends on how severe the AppNotification is.
 */
export class AppNotifIcon {
    public name: string;
    public color: string;

    /**
     * Creates a new AppNotifIcon.
     * @param iconType The type of icon to display represented by an AppNotifSeverity value.
     *                 "Information" will display a blue "i", "Alert" will display a yellow "!", and "Error" will display a red "X".
     */
    public constructor(iconType: AppNotifSeverity) {
        if(iconType == AppNotifSeverity.Information) {
            this.name = "information-circle";
            this.color = "primary"
        }
        else if(iconType == AppNotifSeverity.Alert) {
            this.name = "alert";
            this.color = "warning"
        }
        else {
            this.name = "close-circle";
            this.color = "danger"
        }
    }
}