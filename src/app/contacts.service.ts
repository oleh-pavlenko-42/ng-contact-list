import { effect, Injectable, signal } from '@angular/core';
import { Contact } from './contact.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts = signal<Contact[]>([]);
  private contactsSubject = new BehaviorSubject<Contact[]>([]);

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
}
