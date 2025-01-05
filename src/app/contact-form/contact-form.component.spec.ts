import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormComponent } from './contact-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Router } from '@angular/router';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { ComponentRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';

class MockContactsService {
  getContact(id: string): Contact | null {
    return {
      id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      email: 'john.doe@example.com',
      address: '123 Main St',
    };
  }
  editContact(contact: any) {}
  addContact(contact: any) {}
}

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let componentRef: ComponentRef<ContactFormComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let contactsService: MockContactsService;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: Router, useValue: routerMock },
        { provide: ContactsService, useClass: MockContactsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    contactsService = TestBed.inject(ContactsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form when in edit mode', () => {
    componentRef.setInput('contactId', '1');
    spyOn(contactsService, 'getContact').and.returnValue({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      email: 'john.doe@example.com',
      address: '123 Main St',
    });

    component.ngOnInit();

    expect(component.form.value.firstName).toBe('John');
    expect(component.form.value.lastName).toBe('Doe');
  });

  it('should call editContact when form is valid and in edit mode', () => {
    componentRef.setInput('contactId', '1');
    spyOn(contactsService, 'editContact');
    component.form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    });

    component.onSubmit();

    expect(contactsService.editContact).toHaveBeenCalled();
  });

  it('should call addContact when form is valid and in create mode', () => {
    spyOn(contactsService, 'addContact');
    component.form.patchValue({
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '+1234567890',
    });

    component.onSubmit();

    expect(contactsService.addContact).toHaveBeenCalled();
  });

  it('should navigate to details when closing contact form in edit mode', () => {
    componentRef.setInput('contactId', '1');

    component.closeContactForm();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/details', '1']);
  });

  it('should emit close when closing contact form in create mode', () => {
    spyOn(component.close, 'emit');

    component.closeContactForm();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should delete form control value when deleteValue is called', () => {
    const control = component.form.get('firstName') as FormControl;
    control.setValue('John');

    component.deleteValue(control);

    expect(control.value).toBe(null);
  });

  it('should mark form as invalid if required fields are not filled', () => {
    component.form.controls['firstName'].setValue('');
    component.form.controls['lastName'].setValue('');
    component.form.controls['phone'].setValue('');

    expect(component.form.valid).toBeFalse();
  });

  it('should validate phone number format', () => {
    component.form.controls['phone'].setValue('123');
    expect(component.form.controls['phone'].valid).toBeFalse();

    component.form.controls['phone'].setValue('+1234567890');
    expect(component.form.controls['phone'].valid).toBeTrue();
  });
});
