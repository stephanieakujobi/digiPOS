export class Address {
    private _street: string;
    private _city: string;
    private _region: string;

    public constructor(street: string = "", city: string = "", region: string = "") {
        this._street = street;
        this._city = city;
        this._region = region;
    }

    public get street(): string {
        return this._street;
    }
    public set street(value: string) {
        this._street = value;
    }

    public get city(): string {
        return this._city;
    }
    public set city(value: string) {
        this._city = value;
    }

    public get region(): string {
        return this._region;
    }
    public set region(value: string) {
        this._region = value;
    }

    public get fullAddress(): string {
        return `${this._street}, ${this._city}, ${this._region}`;
    }
}