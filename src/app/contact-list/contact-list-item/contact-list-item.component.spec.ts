import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListItemComponent } from './contact-list-item.component';
import { ComponentRef } from '@angular/core';
import { Contact } from '../../contact.model';
import { Router } from '@angular/router';

describe('ContactListItemComponent', () => {
  let component: ContactListItemComponent;
  let componentRef: ComponentRef<ContactListItemComponent>;
  let fixture: ComponentFixture<ContactListItemComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let mockContact: Contact;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ContactListItemComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListItemComponent);
    componentRef = fixture.componentRef;
    component = fixture.componentInstance;
    mockContact = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
    };

    componentRef.setInput('contact', mockContact);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept a contact input', () => {
    fixture.detectChanges();
    expect(component.contact()).toEqual(mockContact);
  });

  it('should call router.navigate with correct path on goToDetails()', () => {
    fixture.detectChanges();

    component.goToDetails();

    expect(routerMock.navigate).toHaveBeenCalledWith(['details', '1']);
  });
});
