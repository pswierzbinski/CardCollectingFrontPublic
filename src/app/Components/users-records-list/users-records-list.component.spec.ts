import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersRecordsListComponent } from './users-records-list.component';
import { TuiConfirmService } from '@taiga-ui/kit';

describe('UsersRecordsListComponent', () => {
  let component: UsersRecordsListComponent;
  let fixture: ComponentFixture<UsersRecordsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersRecordsListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), TuiConfirmService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersRecordsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
