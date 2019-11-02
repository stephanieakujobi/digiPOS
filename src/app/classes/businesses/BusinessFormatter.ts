import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { IMapPlace } from 'src/app/interfaces/google-maps/IMapPlace';

/**
 * A utility class for providing formatting options for Business data.
 */
export class BusinessFormatter {
    /**
     * Creates a new Business instance with all data fields set to blank strings.
     * @returns A new instance of a blank Business.
     */
    public blankBusiness(): IBusiness {
        const newInstance: IBusiness = {
            name: "",
            address: {
                addressString: "",
                position: null
            },
            owner: {
                name: "",
                email: "",
                phoneNumber: ""
            },
            contactPerson: {
                name: "",
                email: "",
                phoneNumber: ""
            },
            currentProvider: "",
            notes: "",
            saveState: "saved",
            wasManuallySaved: true,
            isReported: false
        };

        return newInstance;
    }

    /**
     * Creates a new Business instance with the same data copied from an existing Business instance.
     * @param business The existing Business to clone.
     * @returns A new instance of a Business with the same data as the original reference.
     */
    public cloneBusiness(business: IBusiness): IBusiness {
        const clone: IBusiness = {
            name: business.name,
            address: {
                addressString: business.address.addressString,
                position: business.address.position
            },
            owner: {
                name: business.owner.name,
                email: business.owner.email,
                phoneNumber: business.owner.phoneNumber
            },
            contactPerson: {
                name: business.contactPerson.name,
                email: business.contactPerson.email,
                phoneNumber: business.contactPerson.phoneNumber
            },
            currentProvider: business.currentProvider,
            notes: business.notes,
            saveState: business.saveState,
            wasManuallySaved: business.wasManuallySaved,
            isReported: business.isReported
        };

        return clone;
    }

    public mapPlaceToBusiness(mapLoc: IMapPlace): IBusiness {
        let business: IBusiness = this.blankBusiness();
        business.name = mapLoc.name;
        business.address.addressString = mapLoc.address;
        business.address.position = mapLoc.position;
        business.saveState = mapLoc.isSaved ? "saved" : "unsaved";
        business.wasManuallySaved = false;

        return business;
    }

    public businessToMapPlace(business: IBusiness): IMapPlace {
        return {
            name: business.name,
            address: business.address.addressString,
            position: business.address.position,
            isSaved: business.saveState !== "unsaved"
        };
    }

    /**
     * Trims all leading and trailing whitespaces in all data fields of a Business.
     * @param business The Business to trim.
     */
    public trimBusiness(business: IBusiness) {
        business.name = business.name.trim();

        business.address.addressString = business.address.addressString.trim();

        business.owner.name = business.owner.name.trim();
        business.owner.email = business.owner.email.trim();
        business.owner.phoneNumber = business.owner.phoneNumber.trim();

        business.contactPerson.name = business.contactPerson.name.trim();
        business.contactPerson.email = business.contactPerson.email.trim();
        business.contactPerson.phoneNumber = business.contactPerson.phoneNumber.trim();

        business.currentProvider = business.currentProvider.trim();

        business.notes = business.notes.trim();
    }

    public formatAddressString(address: string): string {
        //Remove invalid symbols from the address. Commas and '@' are allowed.
        let formattedAddress = address.replace(/[_+\-.!#$%^&*=~`(){}\[\]:;\\/|<>"']/g, '');

        //Remove 2+ consecutive spaces fom the address. Single spaces are allowed.
        formattedAddress = address.replace(/ {2,}/g, ' ');

        //Remove 2+ consecutive commas fom the address. Single commas are allowed.
        formattedAddress = address.replace(/,{2,}/g, ',');

        //Remove 2+ consecutive '@'s fom the address. Single '@'s are allowed.
        formattedAddress = address.replace(/@{2,}/g, '@');

        return formattedAddress.trim();
    }
}