import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatHubComponent } from './chat-hub.component';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('ChatHubComponent', () => {
  let component: ChatHubComponent;
  let fixture: ComponentFixture<ChatHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatHubComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ userName: 'testUser' })), snapshot: { params: { id: '1' } }, queryParams: of({ key: 'value' }) } }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
