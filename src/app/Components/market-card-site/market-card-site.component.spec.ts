import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MarketCardSiteComponent } from './market-card-site.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TuiConfirmService } from '@taiga-ui/kit';

describe('MarketCardSiteComponent', () => {
  let component: MarketCardSiteComponent;
  let fixture: ComponentFixture<MarketCardSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketCardSiteComponent],
      providers: [TuiConfirmService, provideHttpClient(), provideHttpClientTesting(), { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } }, queryParams: of({ key: 'val' }) } }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MarketCardSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
