import { Contact } from './Contact';
import { Address } from './Address';

export class Business {
    private _name: string;
    private _address: Address;
    private _owner: Contact;
    private _contactPerson: Contact;
    private _currentProvider: string;
    private _notes: string;
    private _isSaved: boolean;
    private _isStarred: boolean;
    private _isReported: boolean;

    public constructor(name = "", address = new Address(), owner = new Contact(), contactPerson = new Contact(), currentProvider = "") {
        this.name = name;
        this.address = address
        this.owner = owner
        this.contactPerson = contactPerson;
        this.currentProvider = currentProvider;

        this.notes = "";
        this.isSaved = false;
        this.isStarred = false;
        this.isReported = false;
    }

    public static copyOf(business: Business): Business {
        const copy = new Business(
            business.name,
            business.address,
            business.owner,
            business.contactPerson,
            business.currentProvider
        );

        copy.notes = business.notes;
        copy.isSaved = business.isSaved;
        copy.isStarred = business.isStarred;
        copy.isReported = business.isReported;

        return copy;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get address(): Address {
        return this._address;
    }
    public set address(value: Address) {
        this._address = value;
    }

    public get owner(): Contact {
        return this._owner;
    }
    public set owner(value: Contact) {
        this._owner = value;
    }

    public get contactPerson(): Contact {
        return this._contactPerson;
    }
    public set contactPerson(value: Contact) {
        this._contactPerson = value;
    }

    public get currentProvider(): string {
        return this._currentProvider;
    }
    public set currentProvider(value: string) {
        this._currentProvider = value;
    }

    public get notes(): string {
        return this._notes;
    }
    public set notes(value: string) {
        this._notes = value;
    }

    public get isSaved(): boolean {
        return this._isSaved;
    }
    public set isSaved(value: boolean) {
        this._isSaved = value;
    }

    public get isStarred(): boolean {
        return this._isStarred && this._isSaved;
    }
    public set isStarred(value: boolean) {
        this._isStarred = value && this._isSaved;
    }

    public get isReported(): boolean {
        return this._isReported;
    }
    public set isReported(value: boolean) {
        this._isReported = value;
    }
}