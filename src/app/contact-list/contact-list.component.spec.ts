import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ContactListComponent } from './contact-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { ContactsService } from '../contacts.service';

const mockContacts = [
  { id: '1', firstName: 'John', lastName: 'Doe', phone: '123456789' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', phone: '123456789' },
];

class MockContactsService {
  allContacts = of(mockContacts);
  searchContacts = jasmine.createSpy('searchContacts');
}

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactsService: jasmine.SpyObj<ContactsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactListComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: ContactsService, useClass: MockContactsService },
      ],
    }).compileComponents();

    contactsService = TestBed.inject(
      ContactsService
    ) as jasmine.SpyObj<ContactsService>;
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all contacts on ngOnInit', () => {
    fixture.detectChanges();

    expect(component.contacts()).toEqual(mockContacts);
  });

  it('should update contacts based on search form input', fakeAsync(() => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    tick(300);
    component.searchForm()?.setValue({ search: 'John' });
    tick(300);
    fixture.detectChanges();

    expect(contactsService.searchContacts).toHaveBeenCalledWith('John');
  }));

  it('should open add contact form when openAddContactForm is called', () => {
    component.openAddContactForm();
    fixture.detectChanges();

    expect(component.addContactFormOpen()).toBe(true);
  });

  it('should close add contact form when closeAddContactForm is called', () => {
    component.closeAddContactForm();
    fixture.detectChanges();

    expect(component.addContactFormOpen()).toBe(false);
  });

  it('should unsubscribe from observable on component destruction', () => {
    const spyUnsubscribe = spyOn(component['destroyRef'], 'onDestroy');
    component.ngOnInit();
    component.ngAfterViewInit();

    fixture.destroy();
    expect(spyUnsubscribe).toHaveBeenCalled();
  });
});
