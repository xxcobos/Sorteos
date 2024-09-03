import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsInstagramComponent } from './posts-instagram.component';

describe('PostsInstagramComponent', () => {
  let component: PostsInstagramComponent;
  let fixture: ComponentFixture<PostsInstagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsInstagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsInstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
