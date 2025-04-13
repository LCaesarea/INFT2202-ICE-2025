// src/utils.ts
import { Router } from "./router";
import { Contact } from "./namespace";
import { createContact, updateContact, deleteContact } from "./client/api/contacts"; // Updated import path

interface StorageHelpers {
    save: (key: string, value: string) => void;
    get: (key: string) => string | null;
    remove: (key: string) => void;
}

export const storage: StorageHelpers = {
    save: (key, value) => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(key, value);
        }
    },
    get: (key) => {
        return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    },
    remove: (key) => {
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(key);
        }
    }
};

export function handleCancelClick(router: Router, event: Event): void {
    event.preventDefault();
    router.navigate("/contact-list");
}

export async function AddContact(router: Router, contact: Omit<Contact, 'id'>): Promise<void> {
    try {
        await createContact(contact);
        router.navigate("/contact-list");
    } catch (error) {
        console.error("Failed to add contact:", error);
        alert("Failed to add contact. Please try again.");
    }
}

export async function EditContact(router: Router, id: string, contact: Partial<Contact>): Promise<void> {
    try {
        await updateContact(id, contact);
        router.navigate("/contact-list");
    } catch (error) {
        console.error("Failed to update contact:", error);
        alert("Failed to update contact. Please try again.");
    }
}

export async function DeleteContact(router: Router, id: string): Promise<void> {
    try {
        await deleteContact(id);
        router.navigate("/contact-list");
    } catch (error) {
        console.error("Failed to delete contact:", error);
        alert("Failed to delete contact. Please try again.");
    }
}

export function validateInput(input: HTMLInputElement, regex: RegExp, errorMessage: string): boolean {
    if (!regex.test(input.value)) {
        input.focus();
        input.select();
        alert(errorMessage);
        return false;
    }
    return true;
}

export function getFormInputs(formId: string): { [key: string]: string } {
    const form = document.getElementById(formId) as HTMLFormElement;
    const inputs = form.querySelectorAll('input, textarea, select');
    const values: { [key: string]: string } = {};

    inputs.forEach((input: Element) => {
        const formElement = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (formElement.name) {
            values[formElement.name] = formElement.value;
        }
    });

    return values;
}

export function populateForm(formId: string, data: { [key: string]: string }): void {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;

    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
        if (input) {
            input.value = data[key];
        }
    });
}