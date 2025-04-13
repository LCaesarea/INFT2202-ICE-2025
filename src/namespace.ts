interface ContactData {
    fullName: string;
    contactNumber: string;
    emailAddress: string;
}

export class Contact {
    private _fullName: string;
    private _contactNumber: string;
    private _emailAddress: string;

    constructor(fullName: string = "", contactNumber: string = "", emailAddress: string = "") {
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }

    get fullName(): string { return this._fullName; }
    get contactNumber(): string { return this._contactNumber; }
    get emailAddress(): string { return this._emailAddress; }

    set fullName(value: string) { this._fullName = value; }
    set contactNumber(value: string) { this._contactNumber = value; }
    set emailAddress(value: string) { this._emailAddress = value; }

    serialize(): string | null {
        if (this._fullName && this._contactNumber && this._emailAddress) {
            return JSON.stringify({
                fullName: this._fullName,
                contactNumber: this._contactNumber,
                emailAddress: this._emailAddress
            });
        }
        console.error("Missing required contact fields");
        return null;
    }

    deserialize(data: string): void {
        try {
            if (data.includes(",")) {
                const [fullName, contactNumber, emailAddress] = data.split(",");
                this._fullName = fullName;
                this._contactNumber = contactNumber;
                this._emailAddress = emailAddress;
            } else {
                const obj: ContactData = JSON.parse(data);
                this._fullName = obj.fullName;
                this._contactNumber = obj.contactNumber;
                this._emailAddress = obj.emailAddress;
            }
        } catch (e) {
            console.error("Error deserializing contact:", e);
        }
    }

    toString(): string {
        return `Full Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmail: ${this._emailAddress}`;
    }
}