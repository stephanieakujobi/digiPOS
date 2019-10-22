import { Contact } from './Contact';
import { Address } from './Address';
import { BusinessSaveState } from './BusinessSaveState';

/**
 * The representation of a Business that the user can view on the map, save under their profile, edit information, and report to CPOS's CRM service.
 */
export class Business implements ICloneable<Business> {
    private _name: string;
    private _address: Address;
    private _owner: Contact;
    private _contactPerson: Contact;
    private _currentProvider: string;
    private _notes: string;
    private _saveState: BusinessSaveState;
    private _wasManuallySaved: boolean;
    private _isReported: boolean;

    /**
     * Creates a new Business
     * @param name The name of this Business.
     * @param address The physical address of this Business.
     * @param owner The Contact information of the owner of this Business.
     * @param contactPerson The Contact information of a representitive of this Business who may be in high-contact to discuss business details.
     * @param currentProvider The current point-of-sale provider that this Business uses.
     * @param notes Any additional notes that the user might want to comment on about this business.
     */
    public constructor(name = "", address = new Address(), owner = new Contact(), contactPerson = new Contact(), currentProvider = "", notes = "") {
        this._name = name;
        this._address = address
        this._owner = owner
        this._contactPerson = contactPerson;
        this._currentProvider = currentProvider;
        this._notes = notes;

        this._saveState = BusinessSaveState.Unsaved;
        this._wasManuallySaved = false;
        this._isReported = false;
    }

    public clone(): Business {
        const clone = new Business(this.name, this.address.clone(), this.owner.clone(), this.contactPerson.clone(), this.currentProvider, this.notes);

        clone.saveState = this.saveState;
        clone.wasManuallySaved = this.wasManuallySaved;
        clone.isReported = this.isReported;

        return clone;
    }

    /**
     * Toggles the saveState of this Business between "Saved" and "Starred".
     * Will not perform any action if the saveState is "Unsaved" - a Business must be saved before it can be starred.
     */
    public toggleStarred() {
        if(this.saveState == BusinessSaveState.Saved) {
            this.saveState = BusinessSaveState.Starred;
        }
        else if(this.saveState == BusinessSaveState.Starred) {
            this.saveState = BusinessSaveState.Saved;
        }
    }

    /**
     * The name of this Business.
     */
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        if(this.wasManuallySaved) {
            this._name = value;
        }
    }

    /**
     * The physical address of this Business.
     */
    public get address(): Address {
        return this._address;
    }
    public set address(value: Address) {
        if(this.wasManuallySaved) {
            this._address = value;
        }
    }

    /**
     * The Contact information of the owner of this Business.
     */
    public get owner(): Contact {
        return this._owner;
    }
    public set owner(value: Contact) {
        this._owner = value;
    }

    /**
     * The Contact information of a representitive of this Business who may be in high-contact to discuss business details.
     */
    public get contactPerson(): Contact {
        return this._contactPerson;
    }
    public set contactPerson(value: Contact) {
        this._contactPerson = value;
    }

    /**
     * The current point-of-sale provider that this Business uses.
     */
    public get currentProvider(): string {
        return this._currentProvider;
    }
    public set currentProvider(value: string) {
        this._currentProvider = value;
    }

    /**
     * Any additional notes that the user might want to comment on about this business.
     */
    public get notes(): string {
        return this._notes;
    }
    public set notes(value: string) {
        this._notes = value;
    }

    /**
     * The current save-state of this business.
     * A Business can be marked as "Unsaved", "Saved", or "Starred".
     */
    public get saveState(): BusinessSaveState {
        return this._saveState;
    }
    public set saveState(value: BusinessSaveState) {
        this._saveState = value;
    }

    /**
     * Whether or not this Business was saved manually by the user, instead of being saved from the map.
     * A manually saved Business can have its name and Address changed, whereas a Business saved from the map cannot.
     */
    public get wasManuallySaved(): boolean {
        return this._wasManuallySaved;
    }
    public set wasManuallySaved(value: boolean) {
        this._wasManuallySaved = value;
    }

    /**
     * Whether or not this Business has been reported to CPOS's CRM service by the user.
     */
    public get isReported(): boolean {
        return this._isReported;
    }
    public set isReported(value: boolean) {
        this._isReported = value;
    }
}