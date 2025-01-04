import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsComponent } from './contact-details.component';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { of } from 'rxjs';
import { Contact } from '../contact.model';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let componentRef: ComponentRef<ContactDetailsComponent>;
  let fixture: ComponentFixture<ContactDetailsComponent>;
  let contactsServiceMock: jasmine.SpyObj<ContactsService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeMock: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    contactsServiceMock = jasmine.createSpyObj('ContactsService', [
      'getContact',
      'deleteContact',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routeMock = jasmine.createSpyObj('ActivatedRoute', ['']);

    TestBed.configureTestingModule({
      imports: [ContactDetailsComponent],
      providers: [
        { provide: ContactsService, useValue: contactsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsComponent);
    componentRef = fixture.componentRef;
    component = fixture.componentInstance;

    componentRef.setInput('contactId', '1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contact on init', async () => {
    const mockContact: Contact = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'john@example.com',
    };
    contactsServiceMock.getContact.and.returnValue(mockContact);

    fixture.detectChanges();

    expect(contactsServiceMock.getContact).toHaveBeenCalledWith('1');
    expect(component.contact()).toEqual(mockContact);
  });

  it('should navigate to edit on onEdit', () => {
    component.onEdit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['edit'], {
      relativeTo: routeMock,
    });
  });

  it('should navigate back on back', () => {
    component.back();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should open delete dialog on onDelete', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as any);
    component.onDelete();

    expect(component.dialog.open).toHaveBeenCalledWith(
      DeleteConfirmationDialogComponent
    );

    expect(contactsServiceMock.deleteContact).toHaveBeenCalledWith('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not delete contact if dialog is canceled', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(false),
    } as any);

    component.onDelete();

    expect(component.dialog.open).toHaveBeenCalledWith(
      DeleteConfirmationDialogComponent
    );

    expect(contactsServiceMock.deleteContact).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
