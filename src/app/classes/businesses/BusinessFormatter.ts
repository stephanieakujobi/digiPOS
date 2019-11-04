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
            info: {
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
                notes: ""
            },
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
            info: {
                name: business.info.name,
                address: {
                    addressString: business.info.address.addressString,
                    position: business.info.address.position
                },
                owner: {
                    name: business.info.owner.name,
                    email: business.info.owner.email,
                    phoneNumber: business.info.owner.phoneNumber
                },
                contactPerson: {
                    name: business.info.contactPerson.name,
                    email: business.info.contactPerson.email,
                    phoneNumber: business.info.contactPerson.phoneNumber
                },
                currentProvider: business.info.currentProvider,
                notes: business.info.notes,
            },
            saveState: business.saveState,
            wasManuallySaved: business.wasManuallySaved,
            isReported: business.isReported
        };

        return clone;
    }

    public mapPlaceToBusiness(mapLoc: IMapPlace): IBusiness {
        let business: IBusiness = this.blankBusiness();
        business.info.name = mapLoc.name;
        business.info.address.addressString = mapLoc.address;
        business.info.address.position = mapLoc.position;
        business.saveState = mapLoc.isSaved ? "saved" : "unsaved";
        business.wasManuallySaved = false;

        return business;
    }

    public businessToMapPlace(business: IBusiness): IMapPlace {
        return {
            name: business.info.name,
            address: business.info.address.addressString,
            position: business.info.address.position,
            isSaved: business.saveState !== "unsaved"
        };
    }

    /**
     * Trims all leading and trailing whitespaces in all data fields of a Business.
     * @param business The Business to trim.
     */
    public trimBusiness(business: IBusiness) {
        const values = Object.values(business);

        for(let value of values) {
            if(value != null) {
                if(typeof value == "string") {
                    value = value.trim();
                }
                else if(typeof value == "object") {
                    this.trimBusiness(value);
                }
            }
        }
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