"use strict";
// Wrap in IIFE and attach to core namespace
(function(core) {
    class User {
        constructor(displayName = "", emailAddress = "", username = "", password = "") {
            this.DisplayName = displayName;
            this.EmailAddress = emailAddress;
            this.Username = username;
            this.Password = password;
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
                Password: this.Password
            });
        }

        deserialize(data) {
            const { DisplayName, EmailAddress, Username, Password } = JSON.parse(data);
            this.DisplayName = DisplayName;
            this.EmailAddress = EmailAddress;
            this.Username = Username;
            this.Password = Password;
        }

        toString() {
            return `Display Name: ${this.DisplayName}\nEmail: ${this.EmailAddress}\nUsername: ${this.Username}`;
        }
    }

    core.User = User;
})(core || (core = {}));