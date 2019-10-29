import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';

export class BusinessFormatter {
    private constructor() { }

    public static blankBusiness(): IBusiness {
        const newInstance: IBusiness = {
            name: "",
            address: {
                street: "",
                city: "",
                region: "",
                country: "",
                postalCode: "",
                fullAddress: ""
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

    public static cloneBusiness(business: IBusiness): IBusiness {
        const clone: IBusiness = {
            name: business.name,
            address: {
                street: business.address.street,
                city: business.address.city,
                region: business.address.region,
                country: business.address.country,
                postalCode: business.address.postalCode,
                fullAddress: `${business.address.street}, ${business.address.city}, ${business.address.region}, ${business.address.country}, ${business.address.postalCode}`
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

    public static trimBusiness(business: IBusiness) {
        business.name = business.name.trim();

        business.address.street = business.address.street.trim();
        business.address.city = business.address.city.trim();
        business.address.region = business.address.region.trim();
        business.address.country = business.address.country.trim();
        business.address.postalCode = business.address.postalCode.trim();
        business.address.fullAddress = business.address.fullAddress.trim();

        business.owner.name = business.owner.name.trim();
        business.owner.email = business.owner.email.trim();
        business.owner.phoneNumber = business.owner.phoneNumber.trim();

        business.contactPerson.name = business.contactPerson.name.trim();
        business.contactPerson.email = business.contactPerson.email.trim();
        business.contactPerson.phoneNumber = business.contactPerson.phoneNumber.trim();

        business.currentProvider = business.currentProvider.trim();

        business.notes = business.notes.trim();
    }
}