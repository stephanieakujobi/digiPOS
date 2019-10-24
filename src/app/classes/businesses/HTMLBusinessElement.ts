/**
 * The representation of a Business HTML element displayed in the list on the user's saved Businesses page.
 */
export class HTMLBusinessElement {
    private _nativeElement: HTMLElement;
    private _businessName: string;

    /**
     * Creates a new HTMLBusinessElement
     * @param nativeElement The DOM element to associate with this HTMLBusinessElement.
     * @param businessName The name of the Business displayed on this HTMLBusinessElement.
     */
    public constructor(nativeElement: HTMLElement, businessName: string) {
        this._nativeElement = nativeElement;
        this._businessName = businessName;
    }

    /**
     * @readonly The DOM element to associate with this HTMLBusinessElement.
     */
    public get nativeElement(): HTMLElement {
        return this._nativeElement;
    }

    /**
     * @readonly The name of the Business displayed on this HTMLBusinessElement.
     */
    public get businessName(): string {
        return this._businessName;
    }
}