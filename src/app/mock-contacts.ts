import { Contact } from './contact.model';

export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    phone: '1234567890',
    email: 'johndoe@email.com',
    dateOfBirth: '2000-07-06T21:00:00.000Z',
    address: '123 Main St',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '0987654321',
  },
  {
    id: '3',
    firstName: 'John',
    lastName: 'Smith',
    phone: '1234567890',
  },
  {
    id: '4',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '0987654321',
  },
  {
    id: '5',
    firstName: 'Alice',
    lastName: 'Wonderland',
    phone: '1234567890',
  },
];
