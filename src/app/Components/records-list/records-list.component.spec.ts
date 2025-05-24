import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RecordsListComponent } from './records-list.component';
import { TuiConfirmService } from '@taiga-ui/kit';

describe('RecordsListComponent', () => {
  let component: RecordsListComponent;
  let fixture: ComponentFixture<RecordsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), TuiConfirmService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
