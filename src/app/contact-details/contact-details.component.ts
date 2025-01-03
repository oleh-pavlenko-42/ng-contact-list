import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-contact-details',
  imports: [MatDivider],
  standalone: true,
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit {
  private contactsService = inject(ContactsService);

  contactId = input.required<string>();
  contact = signal<Contact | null>(null);

  ngOnInit(): void {
    this.contact.set(this.contactsService.getContact(this.contactId()));
  }
}
