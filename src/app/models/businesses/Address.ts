import { IAddress } from 'src/app/interfaces/businesses/IAddress';

/**
 * The representation of a physical address.
 */
export class Address implements IAddress, ICloneable<Address> {
    private _street: string;
    private _city: string;
    private _region: string;
    private _country: string;
    private _postalCode: string;

    /**
     * Creates a new Address.
     * @param street The street name of this Address.
     * @param city The city name of this Address.
     * @param region The provice/state name of this Address.
     * @param country The country name of this Address.
     * @param postalCode The postal code of this Address.
     */
    public constructor(street: string = "", city: string = "", region: string = "", country = "", postalCode = "") {
        this._street = street;
        this._city = city;
        this._region = region;
        this._country = country;
        this._postalCode = postalCode;
    }

    public clone(): Address {
        return new Address(this.street, this.city, this.region, this.country, this.postalCode);
    }

    /**
     * The street name of this Address.
     */
    public get street(): string {
        return this._street;
    }
    public set street(value: string) {
        this._street = value;
    }

    /**
     * The city name of this Address.
     */
    public get city(): string {
        return this._city;
    }
    public set city(value: string) {
        this._city = value;
    }

    /**
     * The provice/state name of this Address.
     */
    public get region(): string {
        return this._region;
    }
    public set region(value: string) {
        this._region = value;
    }

    /**
     * @readonly The country name of this Address.
     */
    public get country(): string {
        return this._country;
    }
    public set country(value: string) {
        this._country = value;
    }

    /**
     * The postal code of this Address.
     */
    public get postalCode(): string {
        return this._postalCode;
    }
    public set postalCode(value: string) {
        this._postalCode = value;
    }

    /**
     * @readonly Returns the street, city, and region of this Address in a formatted string.
     */
    public regionalAddress(): string {
        return `${this._street}, ${this._city}, ${this._region}`;
    }

    /**
     * @readonly Returns the street, city, region, and country of this Address in a formatted string.
     */
    public countryAddress(): string {
        return `${this.regionalAddress}, ${this._country}`;
    }

    /**
     * @readonly Returns the street, city, region, country, and postal code of this Address in a formatted string.
     */
    public fullAddress(): string {
        return `${this.countryAddress}, ${this._postalCode}`;
    }
}