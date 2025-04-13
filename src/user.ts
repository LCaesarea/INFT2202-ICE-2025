// src/user.ts
export class User {
    private _displayName: string;
    private _emailAddress: string;
    private _username: string;
    private _password: string;

    constructor(
        displayName: string = "",
        emailAddress: string = "",
        username: string = "",
        password: string = ""
    ) {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._username = username;
        this._password = password;
    }

    // Getters
    get DisplayName(): string { return this._displayName; }
    get EmailAddress(): string { return this._emailAddress; }
    get Username(): string { return this._username; }

    // Setters
    set DisplayName(value: string) { this._displayName = value; }
    set EmailAddress(value: string) { this._emailAddress = value; }
    set Username(value: string) { this._username = value; }

    // Serialization
    serialize(): string {
        return JSON.stringify({
            DisplayName: this.DisplayName,
            EmailAddress: this.EmailAddress,
            Username: this.Username,
            Password: this._password
        });
    }

    deserialize(data: string): void {
        const { DisplayName, EmailAddress, Username, Password } = JSON.parse(data);
        this.DisplayName = DisplayName;
        this.EmailAddress = EmailAddress;
        this.Username = Username;
        this._password = Password;
    }

    toString(): string {
        return `Display Name: ${this.DisplayName}\nEmail: ${this.EmailAddress}\nUsername: ${this.Username}`;
    }
}