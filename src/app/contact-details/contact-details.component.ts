import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { MatDivider } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-contact-details',
  imports: [
    MatDivider,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  standalone: true,
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  contactId = input.required<string>();
  contact = signal<Contact | null>(null);

  ngOnInit(): void {
    const contact = this.contactsService.getContact(this.contactId());
    this.contact.set(contact);
  }

  onEdit(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contactsService.deleteContact(this.contactId());
        this.back();
      }
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
