import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFuturoComponent } from './show-futuro.component';

describe('ShowFuturoComponent', () => {
  let component: ShowFuturoComponent;
  let fixture: ComponentFixture<ShowFuturoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowFuturoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
