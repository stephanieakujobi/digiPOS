export class Contact {
    private _name: string;
    private _email: string;
    private _phoneNumber: string;

    public constructor(name: string = null, email: string = null, phoneNumber: string = null) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get phoneNumber(): string {
        return this._phoneNumber;
    }
    public set phoneNumber(value: string) {
        this._phoneNumber = value;
    }
}