import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CardCommentComponent } from './card-comment.component';
import { CardComment } from '../../Classes/cardComment';

describe('CardCommentComponent', () => {
  let component: CardCommentComponent;
  let fixture: ComponentFixture<CardCommentComponent>;
  let cardComment: CardComment
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCommentComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();
    cardComment = new CardComment(1, 'test comment', new Date(), 1, 'testId', 'testName')
    fixture = TestBed.createComponent(CardCommentComponent);
    component = fixture.componentInstance;
    component.cardComment = cardComment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
