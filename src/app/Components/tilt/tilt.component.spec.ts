import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiltComponent } from './tilt.component';

describe('TiltComponent', () => {
  let component: TiltComponent;
  let fixture: ComponentFixture<TiltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
