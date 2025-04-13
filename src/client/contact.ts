export class Contact {
    public id: string;
    public fullName: string;
    public contactNumber: string;
    public emailAddress: string;

    constructor(
        id: string = '',
        fullName: string = '',
        contactNumber: string = '',
        emailAddress: string = ''
    ) {
        this.id = id;
        this.fullName = fullName;
        this.contactNumber = contactNumber;
        this.emailAddress = emailAddress;
    }
}