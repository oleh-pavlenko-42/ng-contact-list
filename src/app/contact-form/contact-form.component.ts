import { Component, inject, viewChild } from '@angular/core';
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

@Component({
  selector: 'app-contact-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
    MatDatepickerModule,
  ],
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class ContactFormComponent {
  private formDirective = viewChild<NgForm>('formDirective');
  private contactsService = inject(ContactsService);

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

  deleteValue(formControl: FormControl) {
    formControl.reset();
  }

  onSubmit() {
    if (this.form.valid) {
      this.contactsService.addContact({
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        phone: this.form.value.phone!,
        dateOfBirth: this.form.value.dateOfBirth || '',
        email: this.form.value.email || '',
        address: this.form.value.address || '',
      });
      this.formDirective()?.resetForm();
    }
  }
}
