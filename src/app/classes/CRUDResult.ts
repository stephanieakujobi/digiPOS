/**
 * A container class for objects that perform CRUD operations to return upon completion.
 * Defines whether the operation was successful and contains a message of the result of the operation.
 */
export class CRUDResult {
    private _wasSuccessful: boolean;
    private _resultMessage: string;

    public static readonly USER_NOT_AUTHENTICATED: CRUDResult = new CRUDResult(false, "Authentication error - user not logged in.");
    public static readonly BUSINESS_DOES_NOT_EXIST: CRUDResult = new CRUDResult(false, "Failed to update - business does not exist.");
    public static readonly DUPLICATE_BUSINESS_EXISTS: CRUDResult = new CRUDResult(false, "Failed to save business - address already exists.");

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