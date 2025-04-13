// src/user.ts
export class User {
    _displayName;
    _emailAddress;
    _username;
    _password;
    constructor(displayName = "", emailAddress = "", username = "", password = "") {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._username = username;
        this._password = password;
    }
    // Getters
    get DisplayName() { return this._displayName; }
    get EmailAddress() { return this._emailAddress; }
    get Username() { return this._username; }
    // Setters
    set DisplayName(value) { this._displayName = value; }
    set EmailAddress(value) { this._emailAddress = value; }
    set Username(value) { this._username = value; }
    // Serialization
    serialize() {
        return JSON.stringify({
            DisplayName: this.DisplayName,
            EmailAddress: this.EmailAddress,
            Username: this.Username,
            Password: this._password
        });
    }
    deserialize(data) {
        const { DisplayName, EmailAddress, Username, Password } = JSON.parse(data);
        this.DisplayName = DisplayName;
        this.EmailAddress = EmailAddress;
        this.Username = Username;
        this._password = Password;
    }
    toString() {
        return `Display Name: ${this.DisplayName}\nEmail: ${this.EmailAddress}\nUsername: ${this.Username}`;
    }
}
//# sourceMappingURL=user.js.map