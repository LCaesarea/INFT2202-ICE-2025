"use strict";
// Initialize core namespace if it doesn't exist
var core = window.core || {};

(function(core) {
    class Contact {
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        // Getters and setters remain the same
        get fullName() { return this._fullName; }
        get contactNumber() { return this._contactNumber; }
        get emailAddress() { return this._emailAddress; }

        set fullName(value) { this._fullName = value; }
        set contactNumber(value) { this._contactNumber = value; }
        set emailAddress(value) { this._emailAddress = value; }

        serialize() {
            if(this._fullName && this._contactNumber && this._emailAddress) {
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
                // Handle both CSV and JSON formats
                if (data.includes(",")) { // Legacy CSV format
                    const [fullName, contactNumber, emailAddress] = data.split(",");
                    this._fullName = fullName;
                    this._contactNumber = contactNumber;
                    this._emailAddress = emailAddress;
                } else { // JSON format
                    const obj = JSON.parse(data);
                    this._fullName = obj.fullName;
                    this._contactNumber = obj.contactNumber;
                    this._emailAddress = obj.emailAddress;
                }
            } catch (e) {
                console.error("Error deserializing contact:", e);
                return null;
            }
        }

        toString() {
            return `Full Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmail: ${this._emailAddress}`;
        }
    }

    core.Contact = Contact;
})(core);

// Make sure core is available globally
window.core = core;