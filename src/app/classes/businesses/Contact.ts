/**
 * The representation of a person who can be contacted by the user or CPOS.
 */
export class Contact implements ICloneable<Contact> {
    private _name: string;
    private _email: string;
    private _phoneNumber: string;

    /**
     * Creates a new Contact.
     * @param name The name of this Contact.
     * @param email The email of this Contact.
     * @param phoneNumber The phone number of this Contact.
     */
    public constructor(name: string = null, email: string = null, phoneNumber: string = null) {
        this._name = name;
        this._email = email;
        this._phoneNumber = phoneNumber;
    }

    public clone(): Contact {
        return new Contact(this.name, this.email, this.phoneNumber);
    }

    /**
     * The name of this Contact.
     */
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    /**
     * The email of this Contact.
     */
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    /**
     * The phone number of this Contact.
     */
    public get phoneNumber(): string {
        return this._phoneNumber;
    }
    public set phoneNumber(value: string) {
        this._phoneNumber = value;
    }
}