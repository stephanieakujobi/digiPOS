export class BusinessLocation {
    private _name: string;
    private _address: string;
    private _isSaved: boolean;

    public constructor(name: string, address: string, isSaved: boolean) {
        this._name = name;
        this._address = address;
        this._isSaved = isSaved;
    }

    public get name(): string {
        return this._name
    }

    public get address(): string {
        return this._address
    }

    public get isSaved(): boolean {
        return this._isSaved
    }

    public set isSaved(value: boolean) {
        this._isSaved = value;
    }
}