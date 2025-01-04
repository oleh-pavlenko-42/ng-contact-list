import { Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

export const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'details/:contactId', component: ContactDetailsComponent },
  { path: 'details/:contactId/edit', component: ContactFormComponent },
];
