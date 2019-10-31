import { IAddress } from 'src/app/interfaces/businesses/IAddress';

export class AddressParser {
    public parse(address: string): IAddress {
        const components = address.split(',');
        const regionPostal = this.parseRegionPostal(components[2]); //Index 2 of the address contains the combined region and postal code.
        
        return {
            street: components[0].trim(),
            city: components[1].trim(),
            region: regionPostal.region,
            postalCode: regionPostal.postalCode,
            country: components[3].trim(),
            fullAddress: address.trim()
        };
    }

    private parseRegionPostal(string: string): IRegionPostal {
        const split = string.split(' ');
        const region = split[1];
        const postalCode = split[2] + split[3];

        return {
            region: region,
            postalCode: postalCode
        }
    }
}

interface IRegionPostal {
    region: string;
    postalCode: string;
}