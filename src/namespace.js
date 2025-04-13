export class Contact {
    _fullName;
    _contactNumber;
    _emailAddress;
    constructor(fullName = "", contactNumber = "", emailAddress = "") {
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }
    get fullName() { return this._fullName; }
    get contactNumber() { return this._contactNumber; }
    get emailAddress() { return this._emailAddress; }
    set fullName(value) { this._fullName = value; }
    set contactNumber(value) { this._contactNumber = value; }
    set emailAddress(value) { this._emailAddress = value; }
    serialize() {
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
    deserialize(data) {
        try {
            if (data.includes(",")) {
                const [fullName, contactNumber, emailAddress] = data.split(",");
                this._fullName = fullName;
                this._contactNumber = contactNumber;
                this._emailAddress = emailAddress;
            }
            else {
                const obj = JSON.parse(data);
                this._fullName = obj.fullName;
                this._contactNumber = obj.contactNumber;
                this._emailAddress = obj.emailAddress;
            }
        }
        catch (e) {
            console.error("Error deserializing contact:", e);
        }
    }
    toString() {
        return `Full Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmail: ${this._emailAddress}`;
    }
}
//# sourceMappingURL=namespace.js.map