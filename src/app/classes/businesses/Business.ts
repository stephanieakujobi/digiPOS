import { Contact } from './Contact';
import { Address } from './Address';
import { BusinessSaveState } from './BusinessSaveState';

export class Business {
    private _name: string;
    private _address: Address;
    private _owner: Contact;
    private _contactPerson: Contact;
    private _currentProvider: string;
    private _notes: string;
    private _saveState: BusinessSaveState;
    private _wasManuallySaved: boolean;
    private _isReported: boolean;

    public constructor(name = "", address = new Address(), owner = new Contact(), contactPerson = new Contact(), currentProvider = "", notes = "") {
        this.name = name;
        this.address = address
        this.owner = owner
        this.contactPerson = contactPerson;
        this.currentProvider = currentProvider;
        this.notes = notes;
        
        this.saveState = BusinessSaveState.Unsaved;
        this.wasManuallySaved = false;
        this.isReported = false;
    }

    public static copyOf(business: Business): Business {
        const copy = new Business(
            business.name,
            new Address(
                business.address.street,
                business.address.city,
                business.address.region
            ),
            new Contact(
                business.owner.name,
                business.owner.email,
                business.owner.phoneNumber
            ),
            new Contact(
                business.contactPerson.name,
                business.contactPerson.email,
                business.contactPerson.phoneNumber
            ),
            business.currentProvider
        );

        copy.notes = business.notes;
        copy.saveState = business.saveState;
        copy.wasManuallySaved = business.wasManuallySaved;
        copy.isReported = business.isReported;

        return copy;
    }

    public toggleStarred() {
        if(this.saveState == BusinessSaveState.Saved) {
            this.saveState = BusinessSaveState.Starred;
        }
        else if(this.saveState == BusinessSaveState.Starred) {
            this.saveState = BusinessSaveState.Saved;
        }
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

    public get saveState(): BusinessSaveState {
        return this._saveState;
    }
    public set saveState(value: BusinessSaveState) {
        this._saveState = value;
    }

    public get wasManuallySaved(): boolean {
        return this._wasManuallySaved;
    }
    public set wasManuallySaved(value: boolean) {
        this._wasManuallySaved = value;
    }

    public get isReported(): boolean {
        return this._isReported;
    }
    public set isReported(value: boolean) {
        this._isReported = value;
    }
}