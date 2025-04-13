// src/contact.ts
export class Contact {
    public id: string;
    public fullName: string;
    public contactNumber: string;
    public emailAddress: string;

    constructor(fullName: string = '', contactNumber: string = '', emailAddress: string = '') {
        this.id = '';
        this.fullName = fullName;
        this.contactNumber = contactNumber;
        this.emailAddress = emailAddress;
    }

    // Optional: Add serialize/deserialize methods if needed
    serialize(): string {
        return JSON.stringify(this);
    }

    static deserialize(jsonString: string): Contact {
        const data = JSON.parse(jsonString);
        const contact = new Contact(data.fullName, data.contactNumber, data.emailAddress);
        contact.id = data.id;
        return contact;
    }
}