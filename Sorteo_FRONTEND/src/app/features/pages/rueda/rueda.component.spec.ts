import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuedaComponent } from './rueda.component';

describe('RuedaComponent', () => {
  let component: RuedaComponent;
  let fixture: ComponentFixture<RuedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
