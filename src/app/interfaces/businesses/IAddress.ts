/**
 * The representation of a physical address.
 */
export interface IAddress {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;

    regionalAddress(): string;
    countryAddress(): string;
    fullAddress(): string;
}