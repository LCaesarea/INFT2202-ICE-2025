import { Contact } from '../../contact';

const API_BASE = '/api/contacts';

export async function fetchContacts(): Promise<Contact[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return await response.json();
}

export async function fetchContact(id: string): Promise<Contact> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch contact');
    return await response.json();
}

export async function createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok) throw new Error('Failed to create contact');
    return await response.json();
}

export async function updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok) throw new Error('Failed to update contact');
    return await response.json();
}

export async function deleteContact(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete contact');
}