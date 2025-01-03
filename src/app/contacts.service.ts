import { effect, Injectable, signal } from '@angular/core';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts = signal<Contact[]>([]);

  get allContacts() {
    return this.contacts.asReadonly();
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
    });
  }

  addContact(contact: Contact) {
    this.contacts.update((contacts) => [...contacts, contact]);
  }
}
