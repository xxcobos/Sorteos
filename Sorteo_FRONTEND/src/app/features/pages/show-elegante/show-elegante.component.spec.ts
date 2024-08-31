import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEleganteComponent } from './show-elegante.component';

describe('ShowEleganteComponent', () => {
  let component: ShowEleganteComponent;
  let fixture: ComponentFixture<ShowEleganteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowEleganteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowEleganteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
