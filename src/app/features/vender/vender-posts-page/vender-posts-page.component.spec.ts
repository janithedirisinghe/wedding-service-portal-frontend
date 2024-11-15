import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderPostsPageComponent } from './vender-posts-page.component';

describe('VenderPostsPageComponent', () => {
  let component: VenderPostsPageComponent;
  let fixture: ComponentFixture<VenderPostsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderPostsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderPostsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
