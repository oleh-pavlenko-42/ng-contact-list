import { TestBed } from '@angular/core/testing';
import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactsService;
  const mockContacts = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      email: 'john.doe@example.com',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1987654321',
      email: 'jane.smith@example.com',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    service = TestBed.inject(ContactsService);
    expect(service).toBeTruthy();
  });

  it('should get contacts from localStorage if present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(mockContacts)
    );
    service = TestBed.inject(ContactsService);
    expect(service.getContact('1')).toBeTruthy();
    expect(service.getContact('2')).toBeTruthy();
  });

  it('should store contacts in localStorage if not present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    service = TestBed.inject(ContactsService);
    service.contacts.set([]);
    TestBed.flushEffects();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify([])
    );
  });

  it('should get a contact by id', () => {
    localStorage.setItem('contacts', JSON.stringify(mockContacts));
    service = TestBed.inject(ContactsService);
    const contact = service.getContact('1');
    expect(contact).toBeTruthy();
    expect(contact?.firstName).toBe('John');
  });

  it('should return null if contact is not found by id', () => {
    service = TestBed.inject(ContactsService);
    const contact = service.getContact('999');
    expect(contact).toBeNull();
  });

  it('should search contacts by first name, last name, or other fields', () => {
    localStorage.setItem('contacts', JSON.stringify(mockContacts));
    service = TestBed.inject(ContactsService);
    const searchResults = service.searchContacts('John');
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].firstName).toBe('John');
  });

  it('should update a contact', () => {
    service = TestBed.inject(ContactsService);

    expect(service.getContact('1')?.firstName).toBe('John');

    service.editContact({
      id: '1',
      firstName: 'Jack',
      lastName: 'Doe',
      phone: '+1234567890',
    });

    expect(service.getContact('1')?.firstName).toBe('Jack');
  });

  it('should delete a contact', () => {
    service = TestBed.inject(ContactsService);
    service.contacts.set(mockContacts);
    expect(service.getContact('1')).toBeTruthy();

    service.deleteContact('1');

    expect(service.getContact('1')).toBeFalsy();
  });

  afterEach(() => {
    localStorage.removeItem('contacts');
  });
});
