import { Component, inject, OnInit, signal } from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-contact-list',
  imports: [ContactListItemComponent, ContactFormComponent],
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  private contactsService = inject(ContactsService);

  contacts = signal<Contact[]>([]);

  ngOnInit(): void {
    this.contactsService.allContacts.subscribe((allContacts) => {
      console.log('allContacts', allContacts);
      this.contacts.set(allContacts);
    });
  }
}
