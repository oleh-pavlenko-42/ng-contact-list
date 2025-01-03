import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Contact } from '../../contact.model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-contact-list-item',
  imports: [MatCardModule, MatButton],
  standalone: true,
  templateUrl: './contact-list-item.component.html',
  styleUrl: './contact-list-item.component.scss',
})
export class ContactListItemComponent {
  contact = input.required<Contact>();
}
