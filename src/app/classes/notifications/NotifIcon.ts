import { NotifSeverity } from './NotifSeverity';

/**
 * A NotifIcon is the icon that is displayed on the left of AppNotifications when viewed in the notifications tab page.
 * The icon's appearance depends on how severe the AppNotification is.
 */
export class NotifIcon {
    public name: string;
    public color: string;

    /**
     * Creates a new NotifIcon.
     * @param iconSeverity The type of icon to display represented by an NotifSeverity value.
     *                     "info" will display a blue "i", "alert" will display a yellow "!", and "error" will display a red "X".
     */
    public constructor(iconSeverity: NotifSeverity) {
        if(iconSeverity == "info") {
            this.name = "information-circle";
            this.color = "primary"
        }
        else if(iconSeverity == "alert") {
            this.name = "alert";
            this.color = "warning"
        }
        else {
            this.name = "close-circle";
            this.color = "danger"
        }
    }
}