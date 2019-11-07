import { Place } from 'src/app/models/places/Place';
import { MapPlace } from 'src/app/models/google-maps/MapPlace';

/**
 * A utility class for providing formatting options for Places and provides conversion operations between a Place and a MapPlace.
 */
export class PlaceFormatter {
    /**
     * Creates a new Place instance with all data fields set to blank strings.
     * @returns A new instance of a blank Place.
     */
    public blankPlace(): Place {
        const newInstance: Place = {
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
     * Creates a new Place instance with the same data copied from an existing Place instance.
     * @param place The existing Place to clone.
     * @returns A new instance of a Place with the same data as the original reference.
     */
    public clonePlace(place: Place): Place {
        const clone: Place = {
            info: {
                name: place.info.name,
                address: {
                    addressString: place.info.address.addressString,
                    position: place.info.address.position
                },
                owner: {
                    name: place.info.owner.name,
                    email: place.info.owner.email,
                    phoneNumber: place.info.owner.phoneNumber
                },
                contactPerson: {
                    name: place.info.contactPerson.name,
                    email: place.info.contactPerson.email,
                    phoneNumber: place.info.contactPerson.phoneNumber
                },
                currentProvider: place.info.currentProvider,
                notes: place.info.notes,
            },
            saveState: place.saveState,
            wasManuallySaved: place.wasManuallySaved,
            isReported: place.isReported
        };

        return clone;
    }

    /**
     * Creates a new Place instance with the data from a MapPlace instance.
     * @param mapPlace the MapPlace to reference.
     * @returns A Place with the data from the MapPlace.
     */
    public placeFromMapPlace(mapPlace: MapPlace): Place {
        let place: Place = this.blankPlace();
        place.info.name = mapPlace.name;
        place.info.address.addressString = mapPlace.address;
        place.info.address.position = mapPlace.position;
        place.saveState = mapPlace.isSaved ? "saved" : "unsaved";
        place.isReported = mapPlace.isReported;
        place.wasManuallySaved = false;

        return place;
    }

    /**
     * Creates a new MapPlace instance with the data from a Place instance.
     * @param place the Place to reference.
     * @returns a MapPlace with the data from the Place.
     */
    public mapPlaceFromPlace(place: Place): MapPlace {
        return {
            name: place.info.name,
            address: place.info.address.addressString,
            position: place.info.address.position,
            isSaved: place.saveState !== "unsaved",
            isReported: place.isReported
        };
    }

    /**
     * Trims all leading and trailing whitespaces in all data fields of a Place.
     * @param place The Place to trim.
     */
    public trimPlace(place: Place) {
        const values = Object.values(place);

        for(let value of values) {
            if(value != null) {
                if(typeof value == "string") {
                    value = value.trim();
                }
                else if(typeof value == "object") {
                    this.trimPlace(value);
                }
            }
        }
    }

    /**
     * Creates a new Place instance with a formatted address string.
     * @param place The place whose address string to format.
     * @returns A new Place instance with a formatted address.
     */
    public formatPlaceAddress(place: Place): Place {
        const fPlace = place;
        fPlace.info.address.addressString = this.formatAddressString(fPlace.info.address.addressString);
        return fPlace;
    }

    /**
     * Creates a new string from the provided address parameter with proper address formatting; removing invalid symbols and consecutive whitespaces & punctuation.
     * @param address The address string to format.
     * @returns a new string formatted as an address.
     */
    public formatAddressString(address: string): string {
        //Remove invalid symbols from the address. Commas and '@' are allowed.
        let fAddress = address.replace(/[_+\-.!#$%^&*=~`(){}\[\]:;\\/|<>"']/g, '');

        //Remove 2+ consecutive spaces fom the address. Single spaces are allowed.
        fAddress = fAddress.replace(/ {2,}/g, ' ');

        //Remove 2+ consecutive commas fom the address. Single commas are allowed.
        fAddress = fAddress.replace(/,{2,}/g, ',');

        //Remove 2+ consecutive '@'s fom the address. Single '@'s are allowed.
        fAddress = fAddress.replace(/@{2,}/g, '@');

        //Remove any remaining leading & trailing valid symbols.
        fAddress = fAddress.replace(/(^[ ,]*)|([ ,@]*$)/g, '');

        return fAddress.trim();
    }
}