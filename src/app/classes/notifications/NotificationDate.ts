/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/29
*/

export class NotificationDate {
    public rawDate: Date;
    public stringDate: String;

    public constructor(dateReceived: Date) {
        this.rawDate = dateReceived;
        this.stringDate = dateReceived.toDateString();
    }
}