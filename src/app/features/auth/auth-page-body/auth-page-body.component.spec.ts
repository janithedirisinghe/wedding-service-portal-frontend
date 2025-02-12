import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPageBodyComponent } from './auth-page-body.component';

describe('AuthPageBodyComponent', () => {
  let component: AuthPageBodyComponent;
  let fixture: ComponentFixture<AuthPageBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthPageBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthPageBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
