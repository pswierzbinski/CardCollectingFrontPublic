import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldQuantityComponent } from './sold-quantity.component';

describe('SoldQuantityComponent', () => {
  let component: SoldQuantityComponent;
  let fixture: ComponentFixture<SoldQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldQuantityComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SoldQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
