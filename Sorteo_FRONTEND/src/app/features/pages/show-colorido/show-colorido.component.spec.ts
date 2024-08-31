import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowColoridoComponent } from './show-colorido.component';

describe('ShowColoridoComponent', () => {
  let component: ShowColoridoComponent;
  let fixture: ComponentFixture<ShowColoridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowColoridoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowColoridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
