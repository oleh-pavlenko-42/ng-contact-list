import { effect, Injectable, signal } from '@angular/core';
import { Contact } from './contact.model';
import { BehaviorSubject } from 'rxjs';
import { mockContacts } from './mock-contacts';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);

  contacts = signal<Contact[]>(mockContacts);

  get allContacts() {
    return this.contactsSubject.asObservable();
  }

  constructor() {
    const contactsItem = localStorage.getItem('contacts');
    if (contactsItem) {
      this.contacts.set(JSON.parse(contactsItem));
    } else {
      localStorage.setItem('contacts', JSON.stringify(this.contacts()));
    }
    effect(() => {
      localStorage.setItem('contacts', JSON.stringify(this.contacts()));
      this.contactsSubject.next(this.contacts());
    });
  }

  addContact(contact: Contact) {
    this.contacts.update((contacts) => [...contacts, contact]);
  }

  getContact(contactId: string): Contact | null {
    return this.contacts().find((contact) => contact.id === contactId) || null;
  }

  searchContacts(searchValue: string): Contact[] {
    return this.contacts().filter((contact) => {
      return (
        `${contact.firstName} ${contact.lastName}`
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        `${contact.lastName} ${contact.firstName}`
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        contact.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  }

  editContact(updatedContact: Contact) {
    this.contacts.update((contacts) => {
      return contacts.map((contact) => {
        if (contact.id === updatedContact.id) {
          return updatedContact;
        }
        return contact;
      });
    });
  }

  deleteContact(contactId: string) {
    this.contacts.update((contacts) => {
      return contacts.filter((contact) => contact.id !== contactId);
    });
  }
}
