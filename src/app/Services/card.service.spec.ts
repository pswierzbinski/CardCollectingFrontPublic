import { TestBed } from '@angular/core/testing';
import { CardService } from './card.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('CardService', () => {
  let service: CardService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [CardService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CardService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});