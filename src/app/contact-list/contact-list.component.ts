import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  imports: [
    ContactListItemComponent,
    ContactFormComponent,
    MatButtonModule,
    MatInputModule,
    MatIcon,
    FormsModule,
  ],
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit, AfterViewInit {
  private contactsService = inject(ContactsService);
  private destroyRef = inject(DestroyRef);

  searchForm = viewChild<NgForm>('searchForm');
  addContactFormOpen = signal(false);
  contacts = signal<Contact[]>([]);

  ngOnInit(): void {
    const subscription = this.contactsService.allContacts.subscribe(
      (allContacts) => {
        this.contacts.set(allContacts);
      }
    );

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    const subscription = this.searchForm()
      ?.valueChanges?.pipe(debounceTime(300))
      .subscribe((value) => {
        const searchValue = value.search;
        this.contacts.set(
          this.contactsService.searchContacts(searchValue.trim())
        );
      });
    this.destroyRef.onDestroy(() => {
      subscription?.unsubscribe();
    });
  }

  openAddContactForm(): void {
    this.addContactFormOpen.set(true);
  }

  closeAddContactForm(): void {
    this.addContactFormOpen.set(false);
  }
}
