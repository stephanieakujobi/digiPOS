/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/20
*/

import { NotificationSeverity } from './NotificationSeverity';

/**
 * A NotificationIcon is the icon that is displayed on the left of AppNotifications when viewed in the notifications tab page.
 * The icon's appearance depends on how severe the AppNotification is.
 */
export class NotificationIcon {
    private _name: string;
    private _color: string;

    /**
     * Creates a new NotificationIcon.
     * @param iconType The type of icon to display represented by a NotificationSeverity value.
     *                 "Information" will display a blue "i", "Alert" will display a yellow "!", and "Error" will display a red "X".
     */
    public constructor(iconType : NotificationSeverity) {
        if(iconType == NotificationSeverity.Information) {
            this._name = "information-circle";
            this._color = "primary"
        }
        else if(iconType == NotificationSeverity.Alert) {
            this._name = "alert";
            this._color = "warning"
        }
        else {
            this._name = "close-circle";
            this._color = "danger"
        }
    }

    /**
     * The IonIcon name of this NotificationIcon.
     * See https://ionicons.com/ for Ionic's list of icons.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * The Ionic color value of this NotificationIcon.
     * See https://ionicframework.com/docs/theming/colors for Ionic's list of color values.
     */
    public get color(): string {
        return this._color;
    }
}