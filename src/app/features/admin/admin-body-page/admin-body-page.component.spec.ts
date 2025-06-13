import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBodyPageComponent } from './admin-body-page.component';

describe('AdminBodyPageComponent', () => {
  let component: AdminBodyPageComponent;
  let fixture: ComponentFixture<AdminBodyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBodyPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminBodyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
