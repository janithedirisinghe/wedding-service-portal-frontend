import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBusinessInfoComponent } from './register-business-info.component';

describe('RegisterBusinessInfoComponent', () => {
  let component: RegisterBusinessInfoComponent;
  let fixture: ComponentFixture<RegisterBusinessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterBusinessInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterBusinessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
