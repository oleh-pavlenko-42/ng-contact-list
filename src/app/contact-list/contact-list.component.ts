import { Component, inject, OnInit, signal } from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-contact-list',
  imports: [ContactListItemComponent, ContactFormComponent, MatButton],
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  private contactsService = inject(ContactsService);

  addContactFormOpen = signal(false);
  contacts = signal<Contact[]>([]);

  ngOnInit(): void {
    this.contactsService.allContacts.subscribe((allContacts) => {
      this.contacts.set(allContacts);
    });
  }

  openAddContactForm(): void {
    this.addContactFormOpen.set(true);
  }

  closeAddContactForm(): void {
    this.addContactFormOpen.set(false);
  }
}
