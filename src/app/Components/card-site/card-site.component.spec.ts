import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CardSiteComponent } from './card-site.component';
import { TuiPortalService } from '@taiga-ui/cdk';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TuiConfirmService } from '@taiga-ui/kit';
import { CardCommentComponent } from '../card-comment/card-comment.component';
import { By } from '@angular/platform-browser';
import { CardComment } from '../../Classes/cardComment';
import { Card } from '../../Classes/card';
import { CommentService } from '../../Services/comment.service';

describe('CardSiteComponent', () => {
  let component: CardSiteComponent;
  let httpTestController: HttpTestingController;
  let commentService: CommentService;
  let fixture: ComponentFixture<CardSiteComponent>;
  let cardComments: CardComment[] = [new CardComment(1, 'test comment', new Date(), 1, 'testId', 'testName')];
  let card: Card = new Card(1, "testName", "testSeries", "testType", "testFaction", "testSubtype", 1, 1, 1, 1, "testRuleText", "testDesc", "testArtist", "testSrc", "testLicence");
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSiteComponent],
      providers: [TuiPortalService, TuiConfirmService, provideHttpClient(), provideHttpClientTesting(), { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } }, queryParams: of({ key: 'val' }) } }, CardCommentComponent]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CardSiteComponent);
    httpTestController = TestBed.inject(HttpTestingController);
    commentService = TestBed.inject(CommentService);
    component = fixture.componentInstance;
    component.comments = cardComments;
    component.card = card;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card comments', () => {
    component.comments = cardComments;
    fixture.detectChanges();
    const cardCommentDebug = fixture.debugElement.query(By.directive(CardCommentComponent));
    expect(cardCommentDebug).toBeTruthy();
  });

  it('should render the correct number of comment components', () => {
    const cardCommentDebug = fixture.debugElement.queryAll(By.directive(CardCommentComponent));
    expect(cardCommentDebug).toBeTruthy();
    expect(cardCommentDebug.length).toBe(component.comments.length);
  });

  it('should add a card comment', () => {
    spyOn(component.commentService, 'addCardComment').and.callThrough();
    component.card = card;
    component.addCardComment('new comment');
    let newComment = new CardComment(10, 'new comment', new Date("2025-01-02T11:36:00.1599339+01:00"), 1, 'testId', 'testName');
    expect(component.commentService.addCardComment).toHaveBeenCalled();
    const req = httpTestController.expectOne('https://localhost:7200/CardComment/AddCardComment');
    expect(req.request.method).toEqual('POST');
    req.flush(newComment);
    fixture.detectChanges();
    expect(component.comments.length).toBe(2);
    expect(component.comments[1].comment).toBe('new comment');
    expect(component.comments[1].id).toBe(10);
  });

});