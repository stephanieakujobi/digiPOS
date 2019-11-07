/**
 * The date that an AppNotification was recieved, containing the raw Date object for internal operations and
 * the date formatted as a string for displaying onto the page.
 */
export class NotifDate {
    public rawDate: Date;
    public stringDate: string;

    /**
     * Creates a new NotifDate for an AppNotification.
     * @param dateReceived The date that the AppNotification was received.
     */
    public constructor(dateReceived: Date) {
        this.rawDate = dateReceived;
        this.stringDate = dateReceived.toDateString();
    }
}