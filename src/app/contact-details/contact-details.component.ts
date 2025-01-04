import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { MatDivider } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-details',
  imports: [MatDivider, MatCardModule, MatIconModule, MatButtonModule],
  standalone: true,
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private router = inject(Router);

  contactId = input.required<string>();
  contact = signal<Contact | null>(null);

  ngOnInit(): void {
    const contact = this.contactsService.getContact(this.contactId());
    this.contact.set(contact);
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
