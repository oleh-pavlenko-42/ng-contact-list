import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Contact } from '../../contact.model';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list-item',
  imports: [MatCardModule, MatButton],
  standalone: true,
  templateUrl: './contact-list-item.component.html',
  styleUrl: './contact-list-item.component.scss',
})
export class ContactListItemComponent {
  private router = inject(Router);

  contact = input.required<Contact>();

  goToDetails() {
    this.router.navigate(['details', this.contact().id]);
  }
}
