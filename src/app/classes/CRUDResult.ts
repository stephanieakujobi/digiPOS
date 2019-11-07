/**
 * A container class for objects that perform CRUD operations to return upon completion.
 * Defines whether the operation was successful and contains a message of the result of the operation.
 */
export class CRUDResult {
    private _wasSuccessful: boolean;
    private _resultMessage: string;

    /**
     * The template result for when the user tries to perform a CRUD operation without being authenticated into the app.
     */
    public static readonly USER_NOT_AUTHENTICATED: CRUDResult = new CRUDResult(false, "Authentication error - user not logged in.");
 
    /**
     * The template result for when the user tries to perform a CRUD operation on a saved Place that does not exist in the database.
     */
    public static readonly PLACE_DOES_NOT_EXIST: CRUDResult = new CRUDResult(false, "Failed to update - place does not exist.");
   
    /**
     * The template result for when the user tries to save a Place with an address that already exists in their saved Places.
     */
    public static readonly DUPLICATE_PLACE_EXISTS: CRUDResult = new CRUDResult(false, "Failed to save place - address already exists.");

    /**
     * Creates a new CRUDResult.
     * @param wasSuccessful Whether or not the CRUD operation had completed successfully.
     * @param resultMessage The resulting message for the CRUD operation.
     */
    public constructor(wasSuccessful: boolean, resultMessage?: string) {
        this._wasSuccessful = wasSuccessful;
        this._resultMessage = resultMessage;
    }

    /**
     * Whether or not the CRUD operation had completed successfully.
     */
    public get wasSuccessful(): boolean {
        return this._wasSuccessful;
    }

    /**
     * The resulting message for the CRUD operation.
     */
    public get message(): string {
        return this._resultMessage;
    }
}