import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { ContactsService } from '../contacts.service';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
  ],
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class ContactFormComponent implements OnInit {
  private formDirective = viewChild<NgForm>('formDirective');
  private contactsService = inject(ContactsService);
  private router = inject(Router);

  contactId = input<string>();
  isEditMode = computed(() => !!this.contactId());
  close = output();
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+?(\d{1,3})?\(?\d{3}\)?\d{7}$/),
    ]),
    dateOfBirth: new FormControl(''),
    email: new FormControl('', Validators.email),
    address: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.isEditMode()) {
      const contact = this.contactsService.getContact(this.contactId()!);
      this.form.patchValue(contact!);
    }
  }

  deleteValue(formControl: FormControl) {
    formControl.reset();
  }

  closeContactForm() {
    if (this.isEditMode()) {
      this.router.navigate(['/details', this.contactId()]);
    } else {
      this.close.emit();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const contact = {
        id: this.contactId() || new Date().getTime() + this.form.value.phone!,
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        phone: this.form.value.phone!,
        dateOfBirth: this.form.value.dateOfBirth || '',
        email: this.form.value.email || '',
        address: this.form.value.address || '',
      };

      if (this.isEditMode()) {
        this.contactsService.editContact(contact);
      } else {
        this.contactsService.addContact(contact);
      }
      this.formDirective()?.resetForm();
      this.closeContactForm();
    }
  }
}
